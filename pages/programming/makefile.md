<div data-title="Makefile"></div>
<a id="top" data-name="TOP"></a>

# Makefile

- 説明文

---

## シンプルなMakefile

```makefile
# コンパイラ
CC = gcc

# コンパイルオプション
CFLAGS = -Wall -Wextra -std=c99 -O2

# ソースファイル
SRCS = main.c foo.c bar.c

# オブジェクトファイル（.cを.oに置換）
OBJS = $(SRCS:.c=.o)

# 実行ファイル名
TARGET = my_app

# デフォルトターゲット
all: $(TARGET)

# 実行ファイルをリンク
$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET)

# 個別の.oファイルをビルド
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# クリーン（オブジェクトと実行ファイル削除）
clean:
	rm -f $(OBJS) $(TARGET)
```

- `$<`は最初の依存ファイルを、`$@`はターゲットファイルを意味する。
- `make`でビルド、`make cleanで`削除する。
- makeを引数なしで実行した時に最初のターゲット(ルール)つまりallが実行される

---
