// この関数は、ページの<head>に必要なFaviconのリンクをすべて追加します。
(function() {
  // 追加したいFaviconの情報を配列として定義します。
  // 将来的にアイコンを追加・変更したい場合は、この配列を編集するだけです。
  const faviconLinks = [
    { rel: 'icon', href: '/GoRakuDo/favicon/favicon.ico', sizes: 'any' },
    { rel: 'icon', href: '/GoRakuDo/favicon/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' },
    { rel: 'manifest', href: '/GoRakuDo/favicon/site.webmanifest' }
  ];

  // ドキュメントの<head>要素を取得します。
  const head = document.head;

  // 配列の各要素に対して処理を繰り返します。
  faviconLinks.forEach(linkInfo => {
    // 新しい<link>要素を作成します。
    const link = document.createElement('link');

    // linkInfoオブジェクトのプロパティ（rel, hrefなど）を<link>要素の属性として設定します。
    for (const key in linkInfo) {
      link.setAttribute(key, linkInfo[key]);
    }

    // 完成した<link>要素を<head>の末尾に追加します。
    head.appendChild(link);
  });
})();