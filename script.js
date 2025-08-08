const naviUrl = "./layouts/navi.html";

main();

async function main() {
    // history.replaceState(null, "", location.pathname);
    const naviContents = await getNavi(naviUrl);
    document.getElementById("navi").innerHTML = naviContents;
    addLinkListeners();
    console.log("mainが実行されました。"); //
}

// navi情報を取得して返す
async function getNavi(naviUrl) {
    try {
        const response = await fetch(naviUrl);
        if (!response.ok) {
            throw new Error("naviファイルが読み込めません");
        }
        return await response.text();
    } catch (error) {
        document.getElementById("navi").textContent = error;
        return "";
    } finally {
        console.log("getNaviが実行されました。"); //
    }
}

// naviにイベントを追加
async function addLinkListeners() {
    const links = document.querySelectorAll(".md-link");
    links.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute("href");
            await loadContents(href);
        });
    });
    console.log("addLinkListenersが実行されました。"); //
}

async function loadContents(href) {
    const processedHtml = await convertMd(`${href}.md`);
    // history.pushState({ "href": href }, "", href); // 相対パスで動かない
    document.getElementById("main").innerHTML = processedHtml;

    const tocContents = importAnchors();
    document.getElementById("toc").innerHTML = "";
    document.getElementById("toc").appendChild(tocContents);
    console.log("loadContentsが実行されました。"); //
}

// .mdの変換処理
async function convertMd(href) {
    try {
        const response = await fetch(href);
        if (!response.ok) {
            throw new Error("mdファイルが読み込めません");
        }

        const mdText = await response.text();
        const processedHtml = marked.parse(mdText);

        return processedHtml;
    } catch (error) {
        document.getElementById("main").textContent = error;
        return "";
    }
}

// tocの読み込み処理
function importAnchors() {
    const ulTag = document.createElement("ul");
    const anchors = document.querySelectorAll("[data-name]");
    anchors.forEach(anchor => {
        let newA = document.createElement("a");
        newA.textContent = anchor.dataset.name;
        newA.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById(anchor.id).scrollIntoView({ behavior: "smooth", block: "start" });
        })
        let newLi = document.createElement("li");
        newLi.appendChild(newA);
        ulTag.appendChild(newLi);
    })
    console.log("importAnchorsが実行されました。"); //
    return ulTag;
}


// ハンバーガーメニュー
const navi = document.getElementById('navi');
const toc = document.getElementById('toc');
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

























// ファイルが大きくて正常にリロードできない問題の対策
// window.addEventListener("DOMContentLoaded", () => {
//     if (location.hash) {
//         const target = document.querySelector(location.hash);
//         if (target) {
//             target.scrollIntoView();
//         }
//     }
// });
