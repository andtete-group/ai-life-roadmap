import * as React from "https://esm.sh/react@19.1.0";

const h = React.createElement;

const initialForm = {
  name: "",
  theme: "",
  audience: "",
  value: "",
  points: "",
  tone: "親しみやすく、具体的",
  color: "#1677e8",
  cta: "保存して後で試してください"
};

const POST_PATTERNS = [
  {
    type: "初心者向け基礎",
    title: "まず最初に整えること",
    promise: "今日から迷わず始めるための全体像",
    hook: (f) => `${f.audience}へ。${f.theme}は、最初の順番を間違えなければもっと簡単です。`,
    frame: "最初にやることを3つに絞り、行動へ落とし込む投稿"
  },
  {
    type: "よくある間違い",
    title: "やりがちな失敗",
    promise: "遠回りしないための注意点",
    hook: (f) => `${f.theme}で伸び悩む人ほど、実は同じところでつまずいています。`,
    frame: "失敗例から改善策へつなげる投稿"
  },
  {
    type: "実践3ステップ",
    title: "そのまま真似できる手順",
    promise: "何をどの順番で進めるか",
    hook: (f) => `難しいことより、まずは順番。${f.audience}が今日試せる3ステップです。`,
    frame: "手順を短く見せて、保存したくなる投稿"
  },
  {
    type: "保存版チェックリスト",
    title: "投稿前の確認リスト",
    promise: "抜け漏れを防ぐ確認項目",
    hook: (f) => `${f.theme}を進める前に、このチェックだけは済ませておくと安心です。`,
    frame: "チェック項目として使える実用投稿"
  },
  {
    type: "体験・ストーリー",
    title: "変化が伝わるストーリー",
    promise: "悩みから解決までの流れ",
    hook: (f) => `最初から完璧な人はいません。${f.audience}が変わる流れを1つのストーリーにしました。`,
    frame: "共感からサービス価値へ自然につなげる投稿"
  },
  {
    type: "よくある質問",
    title: "質問にまとめて回答",
    promise: "実践前の不安を減らす",
    hook: (f) => `${f.theme}について、よく聞かれる疑問を先にまとめました。`,
    frame: "実践する人の不安を解消する投稿"
  },
  {
    type: "比較",
    title: "自己流と整えたやり方の違い",
    promise: "違いを見える化する",
    hook: (f) => `同じ${f.theme}でも、自己流と整えたやり方では進み方が変わります。`,
    frame: "比較で価値を伝える投稿"
  },
  {
    type: "舞台裏・作り方",
    title: "裏側を見せる",
    promise: "完成までの流れを見せる",
    hook: (f) => `${f.value}は、ただ作って終わりではなく、こういう流れで整えています。`,
    frame: "制作・準備・改善の裏側を信頼材料にする投稿"
  },
  {
    type: "具体的な活用例",
    title: "使う場面がわかる例",
    promise: "自分ごと化できる使い方",
    hook: (f) => `${f.audience}が実際に使うなら、まずこの場面からがおすすめです。`,
    frame: "利用シーンを見せ、欲しい気持ちを作る投稿"
  },
  {
    type: "まとめ・次の行動",
    title: "10投稿の総まとめ",
    promise: "次の行動につなげる",
    hook: (f) => `${f.theme}を始めたい人へ。最後に、見る順番と次にやることをまとめます。`,
    frame: "投稿作成後に何を確認するかまで整理する投稿"
  }
];

function splitInput(text) {
  return text
    .split(/[、,。\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueFill(items, fallback) {
  const values = items.length ? items : fallback;
  const result = [];
  while (result.length < 10) {
    result.push(values[result.length % values.length]);
  }
  return result;
}

function buildCaption(form, pattern, main, next, third, index) {
  const introByIndex = [
    `「興味はあるけど、何から始めればいいかわからない」`,
    `頑張っているのに成果につながらない時は、努力不足ではなく順番の問題かもしれません。`,
    `今日やることを小さくすると、行動のハードルはぐっと下がります。`,
    `投稿前・作業前に見返せるように、確認リストにしました。`,
    `最初は不安でも、流れが見えると一歩目が出しやすくなります。`,
    `検討している人からよく聞かれる不安を、先に整理しました。`,
    `なんとなく進めるより、型を持って進める方が迷いが減ります。`,
    `完成物だけでなく、裏側の流れまで知ると安心して任せやすくなります。`,
    `自分に関係ある使い方が見えると、最初の一歩が決めやすくなります。`,
    `ここまでの内容を、次に動ける形にまとめます。`
  ];

  const closings = [
    `まずは「${main}」だけでも大丈夫です。`,
    `当てはまったら、やり方を少し整えるタイミングです。`,
    `全部やろうとせず、1つずつ進めてください。`,
    `見返せるように保存して、必要な時に使ってください。`,
    `同じ悩みがある人のヒントになれば嬉しいです。`,
    `不安なところから確認すると、判断しやすくなります。`,
    `違いが見えたら、今の進め方を一度見直してみてください。`,
    `「こういう流れで作れるんだ」とイメージできる投稿にしています。`,
    `自分の状況に近いところから試してみてください。`,
    `気になるところは、生成した投稿案を見直して整えてください。`
  ];

  return `${pattern.hook(form)}

${introByIndex[index]}

今回のテーマは「${pattern.title}」です。

見るポイントはこの3つ。

1. ${main}
2. ${next}
3. ${third}

${form.value}

${closings[index]}

${form.cta}`;
}

function buildSlides(form, pattern, main, next, third, index) {
  const slideSets = [
    [
      `${form.theme}\nまず最初に整えること`,
      `迷う理由\nやることが多く見えている`,
      `STEP 1\n${main}`,
      `STEP 2\n${next}`,
      `STEP 3\n${third}`,
      `今日やること\n15分で1つだけ決める`,
      `${form.cta}\n${form.name}`
    ],
    [
      `やりがちな失敗\n${form.theme}`,
      `失敗 1\n情報を集めすぎる`,
      `失敗 2\n${main}を後回しにする`,
      `失敗 3\n${next}を曖昧にする`,
      `改善策\n${third}から小さく試す`,
      `大事なのは\n完璧より継続`,
      `当てはまったら保存\n${form.name}`
    ],
    [
      `そのまま真似できる\n3ステップ`,
      `1\n${main}`,
      `2\n${next}`,
      `3\n${third}`,
      `つまずいた時は\n最初の1つに戻る`,
      `できたら\n次の投稿へつなげる`,
      `${form.cta}\n${form.name}`
    ],
    [
      `保存版\n確認チェックリスト`,
      `□ ${main}`,
      `□ ${next}`,
      `□ ${third}`,
      `□ 伝えたい相手が明確`,
      `□ 次の行動が1つだけ書けている`,
      `必要な時に見返してね\n${form.name}`
    ],
    [
      `はじめは\nここで止まりやすい`,
      `Before\n何から始めるか迷う`,
      `きっかけ\n${main}を決める`,
      `変化\n${next}が動き出す`,
      `続けるコツ\n${third}`,
      `After\n次にやることが見える`,
      `${form.cta}\n${form.name}`
    ],
    [
      `よくある質問\n${form.theme}`,
      `Q1\n初心者でもできますか？`,
      `A1\n${main}から始めれば大丈夫`,
      `Q2\n何を準備しますか？`,
      `A2\n${next}を先に整えます`,
      `Q3\n迷った時は？\n${third}を確認`,
      `不安な人は保存\n${form.name}`
    ],
    [
      `自己流と整えたやり方\n何が違う？`,
      `自己流\nその場で考える`,
      `整えたやり方\n${main}が決まっている`,
      `自己流\n投稿や導線がバラバラ`,
      `整えたやり方\n${next}でつながる`,
      `結果\n${third}が見えやすい`,
      `${form.cta}\n${form.name}`
    ],
    [
      `制作・準備の裏側`,
      `1\n目的を整理する`,
      `2\n${main}`,
      `3\n${next}`,
      `4\n${third}`,
      `5\n見直して使いやすく整える`,
      `裏側も大切にしています\n${form.name}`
    ],
    [
      `こんな場面で使えます`,
      `場面 1\nSNSから興味を持った時`,
      `場面 2\n${main}を知りたい時`,
      `場面 3\n${next}で迷った時`,
      `場面 4\n${third}を試したい時`,
      `まずは身近な場面から`,
      `${form.cta}\n${form.name}`
    ],
    [
      `${form.theme}\n見る順番まとめ`,
      `まず\n${main}`,
      `次に\n${next}`,
      `最後に\n${third}`,
      `迷ったら\n1つ前の投稿を見返す`,
      `次の行動\n投稿前に最終確認`,
      `${form.cta}\n${form.name}`
    ]
  ];

  return slideSets[index].map((slide) => slide.replace(/\n{3,}/g, "\n\n"));
}

function buildPosts(form) {
  const rawPoints = splitInput(form.points);
  const points = uniqueFill(rawPoints, [
    form.value || "最初の目的を決める",
    "必要な情報を整理する",
    "小さく試して改善する",
    "投稿までの流れを整える"
  ]);

  return POST_PATTERNS.map((pattern, index) => {
    const main = points[index];
    const next = points[(index + 1) % points.length];
    const third = points[(index + 2) % points.length];
    const title = `${form.theme}｜${pattern.title}`;
    const slides = buildSlides(form, pattern, main, next, third, index);
    const caption = buildCaption(form, pattern, main, next, third, index);

    return {
      id: index + 1,
      type: pattern.type,
      title,
      caption,
      slides,
      visual: `CodexでInstagram正方形カルーセル画像を7枚作るための指示。ブランド名は「${form.name}」。テーマは「${form.theme}」。${form.tone}。ブランドカラー${form.color}をアクセントに使い、余白を広く、文字は大きく読みやすく。投稿の狙いは「${pattern.frame}」。各画像には指定された7枚分の文章をそのまま入れ、1枚ごとに表紙・問題提起・要点・まとめの役割が分かるデザインにする。ChatGPTとCodexで完成させる前提で作る。`,
      reel: `短い動画に転用する場合：冒頭2秒で「${pattern.title}」を大きく表示。次に悩みを1つ見せ、${main} → ${next} → ${third} の順にテンポよく表示。最後は「${form.cta}」で保存やコメントへ促す。`,
      tags: buildTags(form, pattern)
    };
  });
}

function buildTags(form, pattern) {
  const cleanTheme = form.theme.replace(/\s/g, "");
  const cleanName = form.name.replace(/\s/g, "");
  const base = [`#${cleanTheme}`, `#${cleanName}`, "#保存版", "#初心者向け"];
  const byType = {
    "初心者向け基礎": "#はじめ方",
    "よくある間違い": "#失敗しない",
    "実践3ステップ": "#実践方法",
    "保存版チェックリスト": "#チェックリスト",
    "体験・ストーリー": "#ストーリー投稿",
    "よくある質問": "#よくある質問",
    "比較": "#比較投稿",
    "舞台裏・作り方": "#制作の裏側",
    "具体的な活用例": "#活用例",
    "まとめ・導線": "#まとめ投稿"
  };
  return [...base, byType[pattern.type]].filter((tag) => tag !== "#").join(" ");
}

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem("ai-life-sns-simple") || "null");
  } catch {
    return null;
  }
}

function Tool7App() {
  const [form, setForm] = React.useState(initialForm);
  const [posts, setPosts] = React.useState([]);
  const [ready, setReady] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(1);
  const [done, setDone] = React.useState([]);
  const [tab, setTab] = React.useState("posts");
  const [guideDone, setGuideDone] = React.useState([]);
  const [toast, setToast] = React.useState("");

  React.useEffect(() => {
    const saved = getSavedState();
    if (!saved) return;
    setForm(saved.brand || initialForm);
    setPosts(saved.posts || []);
    setDone(saved.done || []);
    setGuideDone(saved.guideDone || saved.envDone || []);
    setReady(Boolean(saved.posts?.length));
  }, []);

  function save(nextPosts = posts, nextDone = done, nextGuideDone = guideDone) {
    localStorage.setItem(
      "ai-life-sns-simple",
      JSON.stringify({ brand: form, posts: nextPosts, done: nextDone, guideDone: nextGuideDone })
    );
  }

  function generatePosts() {
    const nextPosts = buildPosts(form);
    setPosts(nextPosts);
    setReady(true);
    setSelectedId(1);
    setDone([]);
    setGuideDone([]);
    localStorage.setItem(
      "ai-life-sns-simple",
      JSON.stringify({ brand: form, posts: nextPosts, done: [], guideDone: [] })
    );
  }

  async function copyText(text, message) {
    await navigator.clipboard.writeText(text);
    setToast(message);
    setTimeout(() => setToast(""), 1300);
  }

  if (!ready) {
    return h(
      "main",
      { className: "p7" },
      h(TopBar, null),
      h(
        "section",
        { className: "p7-onboard" },
        h(
          "div",
          null,
          h("p", { className: "p7-kicker" }, "INSTAGRAM POST MAKER"),
          h("h1", null, "入力したら、", h("br"), h("em", null, "投稿10本が完成。")),
          h(
            "p",
            null,
            "Instagramへ投稿できる本文・カルーセル文章・Codex用の画像制作指示を10本まとめて作ります。"
          ),
          h(
            "div",
            null,
            h("b", null, "1"),
            h("span", null, "内容入力"),
            h("b", null, "10"),
            h("span", null, "投稿案"),
            h("b", null, "7枚"),
            h("span", null, "画像文章")
          ),
          h(
            "aside",
            null,
            h("b", null, "使い方"),
            h("span", null, "① 発信内容を入力"),
            h("span", null, "② 10投稿を作成"),
            h("span", null, "③ ChatGPT・Codexへコピー")
          )
        ),
        h(
          "form",
          {
            onSubmit: (event) => {
              event.preventDefault();
              generatePosts();
            }
          },
          h("p", { className: "p7-kicker" }, "POST INFORMATION"),
          h("h2", null, "投稿に使う内容を入力"),
          h(
            "div",
            { className: "p7-two" },
            h(InputField, {
              label: "アカウント名",
              required: true,
              value: form.name,
              placeholder: "例：AI LIFE",
              onChange: (name) => setForm({ ...form, name })
            }),
            h(
              "label",
              null,
              "ブランドカラー",
              h("input", {
                type: "color",
                value: form.color,
                onChange: (event) => setForm({ ...form, color: event.target.value })
              })
            )
          ),
          h(InputField, {
            label: "発信テーマ",
            required: true,
            value: form.theme,
            placeholder: "例：初心者向けAI仕事術",
            onChange: (theme) => setForm({ ...form, theme })
          }),
          h(InputField, {
            label: "届けたい相手",
            required: true,
            value: form.audience,
            placeholder: "例：AIを仕事に使いたい個人事業主",
            onChange: (audience) => setForm({ ...form, audience })
          }),
          h(InputField, {
            label: "届けたい価値・商品",
            required: true,
            value: form.value,
            placeholder: "例：AI LIFE第7章で、Instagram投稿10本を作れる",
            onChange: (value) => setForm({ ...form, value })
          }),
          h(
            "label",
            null,
            "投稿で伝えたい具体的な内容",
            h("input", {
              required: true,
              value: form.points,
              onChange: (event) => setForm({ ...form, points: event.target.value }),
              placeholder: "例：投稿テーマ、ターゲット、悩み、解決策、投稿本文、画像文、投稿前チェック"
            }),
            h("small", null, "複数ある場合は「、」で区切ってください。10投稿の中身に分散して反映されます。")
          ),
          h(
            "div",
            { className: "p7-two" },
            h(InputField, {
              label: "文章の雰囲気",
              value: form.tone,
              onChange: (tone) => setForm({ ...form, tone })
            }),
            h(InputField, {
              label: "最後に促す行動",
              value: form.cta,
              onChange: (cta) => setForm({ ...form, cta })
            })
          ),
          h("button", null, "投稿10本を作成する →"),
          h("small", null, "公開前に内容・リンク・画像の権利・個人情報を確認してください。")
        )
      )
    );
  }

  const selected = posts.find((post) => post.id === selectedId) || posts[0];
  const allText = posts
    .map((post) => `# ${post.id}. ${post.title}\n\n${post.caption}\n\n${post.tags}\n\n画像7枚：\n${post.slides.map((slide, index) => `${index + 1}枚目：${slide}`).join("\n\n")}\n\n画像制作指示：${post.visual}\n\nリール転用：${post.reel}`)
    .join("\n\n---\n\n");

  return h(
    "main",
    { className: "p7" },
    h(
      "header",
      { className: "p7-header" },
      h(Brand, null),
      h(
        "nav",
        null,
        h("button", { className: tab === "posts" ? "active" : "", onClick: () => setTab("posts") }, "完成した10投稿"),
        h("button", { className: tab === "guide" ? "active" : "", onClick: () => setTab("guide") }, "ChatGPT・Codexで仕上げる")
      ),
      h("button", { onClick: () => setReady(false) }, "入力を変更")
    ),
    tab === "posts" &&
      selected &&
      h(PostsView, {
        form,
        posts,
        selected,
        selectedId,
        setSelectedId,
        done,
        setDone,
        save,
        allText,
        copyText
      }),
    tab === "guide" && h(GuideView, { form, guideDone, setGuideDone, save }),
    toast && h("div", { className: "p7-toast" }, toast, " ✓")
  );
}

function PostsView({ form, posts, selected, selectedId, setSelectedId, done, setDone, save, allText, copyText }) {
  return h(
    "section",
    { className: "p7-studio" },
    h(
      "aside",
      null,
      h(
        "div",
        null,
        h("p", { className: "p7-kicker" }, "READY TO POST"),
        h("h2", null, "完成した10投稿"),
        h("p", null, "番号を選ぶと、投稿本文・画像7枚の文章・制作指示を確認できます。")
      ),
      posts.map((post) =>
        h(
          "button",
          {
            key: post.id,
            className: `${selectedId === post.id ? "active" : ""} ${done.includes(post.id) ? "done" : ""}`,
            onClick: () => setSelectedId(post.id)
          },
          h("i", null, done.includes(post.id) ? "✓" : String(post.id).padStart(2, "0")),
          h("span", null, h("small", null, post.type), h("b", null, post.title))
        )
      ),
      h("button", { className: "copy-all", onClick: () => copyText(allText, "10投稿をまとめてコピーしました") }, "10投稿をまとめてコピー")
    ),
    h(
      "article",
      { className: "p7-editor" },
      h("div", { className: "p7-ready" }, "このまま下書きに使えます ", h("b", null, `POST ${String(selected.id).padStart(2, "0")}`)),
      h(
        "header",
        null,
        h(
          "div",
          null,
          h("span", null, selected.type),
          h("h1", null, selected.title),
          h("p", null, "本文・ハッシュタグ・画像用文章・制作指示まで投稿ごとに変えています。")
        ),
        h("i", { style: { background: form.color } }, selected.id)
      ),
      h(
        "section",
        null,
        h("span", null, "POST CAPTION"),
        h("h3", null, "Instagram投稿本文"),
        h("pre", null, selected.caption, "\n\n", selected.tags),
        h("button", { className: "p7-primary-copy", onClick: () => copyText(`${selected.caption}\n\n${selected.tags}`, "投稿本文をコピーしました") }, "投稿本文をコピー →")
      ),
      h(
        "section",
        null,
        h("span", null, "CAROUSEL TEXT"),
        h("h3", null, "画像7枚に入れる文章"),
        selected.slides.map((slide, index) =>
          h("div", { className: "slide-row", key: `${index}-${slide}` }, h("b", null, index + 1), h("p", null, slide))
        ),
        h("button", { onClick: () => copyText(selected.slides.map((slide, index) => `${index + 1}枚目：${slide}`).join("\n\n"), "画像用文章をコピーしました") }, "7枚分をコピー")
      ),
      h(
        "section",
        { className: "p7-visual" },
        h("span", null, "CODEX IMAGE PROMPT"),
        h("h3", null, "Codexで画像を作るための指示"),
        h("p", null, selected.visual),
        h("button", { onClick: () => copyText(selected.visual, "画像制作指示をコピーしました") }, "画像制作指示をコピー")
      ),
      h(
        "section",
        null,
        h("span", null, "REEL VERSION"),
        h("h3", null, "リールへ転用する場合"),
        h("p", null, selected.reel)
      ),
      h(
        "footer",
        null,
        h(
          "button",
          {
            className: done.includes(selected.id) ? "done" : "",
            onClick: () => {
              const nextDone = done.includes(selected.id)
                ? done.filter((id) => id !== selected.id)
                : [...done, selected.id];
              setDone(nextDone);
              save(posts, nextDone);
            }
          },
          done.includes(selected.id) ? "投稿済み・完成 ✓" : "この投稿を完成にする"
        )
      )
    )
  );
}

function GuideView({ form, guideDone, setGuideDone, save }) {
  const steps = [
    {
      title: "投稿の目的を確認",
      body: `まず「誰に、何を伝える投稿か」を確認します。${form.name || "アカウント"}の投稿として違和感がないか、テーマと届けたい相手を見直します。`
    },
    {
      title: "ChatGPTで本文を整える",
      body: "「投稿本文をコピー」してChatGPTへ貼り、言い回し・改行・読みやすさを整えます。事実と表現に違和感がないかも確認します。"
    },
    {
      title: "Codexで画像を作る",
      body: "「画像7枚に入れる文章」と「Codexで画像を作るための指示」をCodexへ貼り、正方形のInstagram投稿画像を作成します。"
    },
    {
      title: "画像と本文をセットで確認",
      body: "画像の文字切れ、誤字、読みにくさ、本文とのズレを確認します。特に1枚目は、保存したくなる表紙になっているかを見ます。"
    },
    {
      title: "Instagramへ投稿",
      body: "完成した画像7枚と投稿本文をInstagramに入れます。投稿前にハッシュタグ、改行、誤字、権利関係を最終確認します。"
    },
    {
      title: "反応を見て次の投稿へ反映",
      body: "保存数・コメント・閲覧数を見て、反応が良い言い回しやテーマを次の10投稿作成に反映します。"
    }
  ];

  return h(
    "section",
    { className: "p7-environment" },
    h(
      "header",
      null,
      h(
        "div",
        null,
        h("p", { className: "p7-kicker" }, "HOW TO USE"),
        h("h1", null, "ChatGPT・Codexで仕上げる"),
        h("p", null, "購入者が、第7章のツールで作った投稿案を画像と本文まで仕上げる流れです。")
      ),
      h("b", null, Math.round((guideDone.length / steps.length) * 100), "%")
    ),
    h(
      "div",
      null,
      steps.map((step, index) =>
        h(
          "label",
          { key: step.title, className: guideDone.includes(index) ? "done" : "" },
          h("button", {
            onClick: () => {
              const nextGuideDone = guideDone.includes(index)
                ? guideDone.filter((id) => id !== index)
                : [...guideDone, index];
              setGuideDone(nextGuideDone);
              save(undefined, undefined, nextGuideDone);
            }
          }, guideDone.includes(index) ? "✓" : ""),
          h("span", null, h("small", null, `STEP ${String(index + 1).padStart(2, "0")}`), h("b", null, step.title), h("p", null, step.body))
        )
      )
    ),
    h(
      "aside",
      null,
      h("b", null, "使い方の目安"),
      h("p", null, "この画面だけで完成画像までは生成しません。投稿本文と画像7枚の文章を作り、Codexへ渡してInstagram用の正方形画像を作る、という使い方にしています。")
    )
  );
}

function InputField({ label, value, onChange, placeholder = "", required = false }) {
  return h(
    "label",
    null,
    label,
    h("input", {
      required,
      value,
      placeholder,
      onChange: (event) => onChange(event.target.value)
    })
  );
}

function TopBar() {
  return h("header", { className: "topbar" }, h(Brand, null), h("span", { className: "chapter-pill" }, "第7章 成果物ワーク"));
}

function Brand() {
  return h(
    "a",
    { className: "brand", href: "/" },
    h("span", { className: "brandmark" }, "AI"),
    h("span", null, h("b", null, "あいらいふ"), h("small", null, "AI LIFE ACADEMY"))
  );
}

export default function Tool7() {
  return h(Tool7App);
}
