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

const updateOverlay = () => {
    overlay.classList.toggle('show', navi.classList.contains('open') || toc.classList.contains('open'));
};

document.getElementById('menuBtn').addEventListener('click', () => {
    const isOpening = !navi.classList.contains('open');
    navi.classList.toggle('open', isOpening);
    toc.classList.remove('open');
    updateOverlay();
});

document.getElementById('tocBtn').addEventListener('click', () => {
    const isOpening = !toc.classList.contains('open');
    toc.classList.toggle('open', isOpening);
    navi.classList.remove('open');
    updateOverlay();
});

toc.addEventListener('click', (event) => {
    if (!event.target.closest?.('a')) return;
    toc.classList.remove('open');
    updateOverlay();
});

overlay.addEventListener('click', () => {
    navi.classList.remove('open');
    toc.classList.remove('open');
    overlay.classList.remove('show');
});

// コピーボタン
document.addEventListener('DOMContentLoaded', () => {
    const initCopyButtons = () => {
        // Jekyllが出力するコードブロックを取得（div.highlight または親を持たない pre.highlight）
        const codeBlocks = document.querySelectorAll('div.highlight, pre.highlight:not(div.highlight *)');

        codeBlocks.forEach((block) => {
            // 既存の要素構造に合わせてボタンを作成
            const button = document.createElement('button');
            button.className = 'copy-code-button';
            button.type = 'button';
            button.innerText = 'Copy';

            // クリック時のコピー処理
            button.addEventListener('click', () => {
                const codeElement = block.querySelector('code');
                const code = codeElement ? codeElement.innerText : (() => {
                    const clone = block.cloneNode(true);
                    clone.querySelector('.copy-code-button')?.remove();
                    return clone.innerText;
                })();

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
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initCopyButtons);
    } else {
        setTimeout(initCopyButtons, 0);
    }
});