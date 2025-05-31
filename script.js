// ファイルが大きくて正常にリロードできない問題の対策
window.addEventListener("DOMContentLoaded", () => {
    if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
            target.scrollIntoView();
        }
    }
});


// naviの読み込み処理
function addLinkListeners() {
    const links = document.querySelectorAll(".md-link");
    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const path = event.currentTarget.getAttribute("href");
            convertMd(path);
        });
    });
}

fetch("./layouts/navi.html")
    .then(response => {
        if (!response.ok) {
            throw new Error("naviファイルが読み込みません");
        }
        return response.text();
    })
    .then(navi => {
        document.getElementById("navi").innerHTML = navi;
        addLinkListeners();
    })
    .catch(error => {
        document.getElementById("navi").textContent = error;
    });


// .mdの変換処理
function convertMd(path) {
    fetch(`./pages/${path}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error("mdファイルが読み込めません");
            }
            return response.text();
        })
        .then(markdown => {
            const html = marked.parse(markdown);
            document.getElementById("main").innerHTML = html;
            importAnchors();
        })
        .catch(error => {
            document.getElementById("main").textContent = error;
        })
}


// tocの読み込み処理
function importAnchors() {
    const ulTag = document.querySelector("#toc ul");
    ulTag.innerHTML = ""; // ulタグをリセット
    const anchors = document.querySelectorAll("[data-name]");

    anchors.forEach(anchor => {
        let newA = document.createElement("a");
        newA.textContent = anchor.dataset.name;
        newA.href = `#${anchor.id}`;
        let newLi = document.createElement("li");
        newLi.appendChild(newA);
        ulTag.appendChild(newLi);
    })
}