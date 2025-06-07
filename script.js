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

// window.addEventListener('popstate', (event) => {
//     const href = event.href;
//     loadContents(href);
// });

























// ファイルが大きくて正常にリロードできない問題の対策
// window.addEventListener("DOMContentLoaded", () => {
//     if (location.hash) {
//         const target = document.querySelector(location.hash);
//         if (target) {
//             target.scrollIntoView();
//         }
//     }
// });
