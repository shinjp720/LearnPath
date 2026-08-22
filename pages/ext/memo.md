---
title: Memo
layout: default
---

# Memo <a id="top" data-name="TOP"></a>

DRF（Django REST Framework）を利用している場合は、`Serializer` を活用するとバリデーションエラーとDBエラーの分離がよりスマートに行えます。

最大10件程度であれば、各要素をループ処理で個別に `Serializer` へ通し、保存・削除処理を `transaction.atomic()` で囲む構成が最適です。

**DRFでの実装例**

```python
from django.db import DatabaseError, transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class BatchProcessView(APIView):

    def post(self, request):
        items = request.data  # リスト形式のデータを取り出し
        results = []

        for item in items:
            action = item.get("action")
            item_id = item.get("id")
            data = item.get("data", {})

            # 各要素ごとの結果格納用データ構造
            res_item = {
                "id": item_id,
                "action": action,
                "status": "success",
                "error_type": None,
                "error_detail": None,
            }

            try:
                # 1要素ごとに独立したトランザクションにする
                with transaction.atomic():

                    if action == "create":
                        serializer = MyModelSerializer(data=data)
                        if not serializer.is_valid():
                            res_item["status"] = "failed"
                            res_item["error_type"] = "validation_error"
                            res_item["error_detail"] = serializer.errors
                            results.append(res_item)
                            continue  # バリデーション失敗時はDB保存へ進まない

                        serializer.save()

                    elif action == "update":
                        instance = MyModel.objects.get(id=item_id)
                        serializer = MyModelSerializer(
                            instance, data=data, partial=True
                        )
                        if not serializer.is_valid():
                            res_item["status"] = "failed"
                            res_item["error_type"] = "validation_error"
                            res_item["error_detail"] = serializer.errors
                            results.append(res_item)
                            continue

                        serializer.save()

                    elif action == "delete":
                        instance = MyModel.objects.get(id=item_id)
                        instance.delete()

            except MyModel.DoesNotExist:
                res_item["status"] = "failed"
                res_item["error_type"] = "not_found"
                res_item["error_detail"] = (
                    f"ID {item_id} のデータが見つかりません。"
                )

            except DatabaseError as e:
                # DB制約違反やデッドロックなどのDBエラーを捕捉
                res_item["status"] = "failed"
                res_item["error_type"] = "db_error"
                res_item["error_detail"] = str(e)

            except Exception as e:
                res_item["status"] = "failed"
                res_item["error_type"] = "unexpected_error"
                res_item["error_detail"] = str(e)

            results.append(res_item)

        # 全体の実行結果をまとめて返す
        return Response(results, status=status.HTTP_200_OK)r
```

**ポイント**

* **バリデーションエラーの補獲**: `serializer.is_valid()` が `False` の場合、`serializer.errors` に失敗したフィールド名とメッセージが辞書形式でセットされるため、これをそのまま拾います。
* **DBエラーの補獲**: `is_valid()` を通過しても、DBのユニーク制約や外部キー制約、DB接続問題で落ちた場合は `DatabaseError` が捕捉されます。
* **10件程度に最適な可読性**: 複雑な BulkSerializer を定義するよりも、直感的にフローを制御でき、エラーメッセージもレスポンスとして分かりやすく整理できます。