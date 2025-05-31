// ファイルが大きくて正常にリロードできない問題の対策
window.addEventListener("DOMContentLoaded", () => {
    if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
            target.scrollIntoView();
        }
    }
});
