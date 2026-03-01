import { visit } from 'unist-util-visit';

export function remarkYouTube() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (
        node.children?.length === 1 &&
        node.children[0].type === 'inlineCode'
      ) {
        const value = node.children[0].value;
        if (value.startsWith('youtube:')) {
          const url = value.replace('youtube:', '').trim();
          const videoId = extractVideoId(url);
          if (videoId) {
            parent.children[index] = {
              type: 'html',
              value: `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`,
            };
          }
        }
      }
    });
  };
}

function extractVideoId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/
  );
  return match ? match[1] : null;
}
