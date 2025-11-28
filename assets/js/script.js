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

// const toc = document.getElementById("toc");

// const ulTag = document.createElement("ul");
// const anchors = document.querySelectorAll("[data-name]");
// anchors.forEach(anchor => {
//     let newLi = document.createElement("li");
//     let newA = document.createElement("a");
//     newA.textContent = anchor.dataset.name;
//     newA.href = "#" + anchor.id;
//     newLi.appendChild(newA);
//     ulTag.appendChild(newLi);
// });
// const tocContents = ulTag;
// toc.appendChild(tocContents);

// //////////////////////
// document.querySelectorAll('#toc a').forEach(a => {
//     a.addEventListener("click", (e) => {
//         e.preventDefault();
//         const id = a.getAttribute("href").substring(1);
//         const target = document.getElementById(id);
//         target.scrollIntoView({ behavior: "smooth", block: "start" });
//         location.hash = id; // 履歴に確実に積む
//     });
// });
// //////////////////////

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