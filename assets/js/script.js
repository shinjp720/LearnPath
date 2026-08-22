// tocの読み込み
const toc = document.getElementById("toc");

const ulTag = document.createElement("ul");
const anchors = document.querySelectorAll("[data-name]");
anchors.forEach(anchor => {
    let newLi = document.createElement("li");
    let newA = document.createElement("a");
    newA.textContent = anchor.dataset.name;
    newA.href = "#" + anchor.id;  // 普通のアンカーリンク
    newLi.appendChild(newA);
    ulTag.appendChild(newLi);
});
toc.appendChild(ulTag);

// ハンバーガーメニュー
const navi = document.getElementById('navi');
const overlay = document.getElementById('overlay');

document.getElementById('menuBtn').addEventListener('click', () => {
    navi.classList.toggle('open');
    if (navi.classList.contains('open')) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
});

document.getElementById('tocBtn').addEventListener('click', () => {
    toc.classList.toggle('open');
    if (toc.classList.contains('open')) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
});

overlay.addEventListener('click', () => {
    navi.classList.remove('open');
    toc.classList.remove('open');
    overlay.classList.remove('show');
});

// コピーボタン
document.addEventListener('DOMContentLoaded', () => {
    // Jekyllが出力するコードブロックを取得（.highlight または pre）
    const codeBlocks = document.querySelectorAll('div.highlight, pre.highlight');

    codeBlocks.forEach((block) => {
        // 既存の要素構造に合わせてボタンを作成
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = 'Copy';

        // クリック時のコピー処理
        button.addEventListener('click', () => {
            const code = block.querySelector('code')?.innerText || block.innerText;

            navigator.clipboard.writeText(code).then(() => {
                button.innerText = 'Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch((err) => {
                console.error('Failed to copy: ', err);
            });
        });

        // ボタンをコードブロック内に追加
        block.appendChild(button);
    });
});