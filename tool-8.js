import * as React from "https://esm.sh/react@19.1.0";

const h = React.createElement;

const initialForm = {
  account: "",
  theme: "",
  audience: "",
  points: "",
  style: "AI画像＋AI音声",
  editor: "CapCut",
  duration: "30",
  platform: "Instagramリール・TikTok",
  tone: "親しみやすく、テンポよく",
  cta: "保存して、今日ひとつ試してください"
};

const VIDEO_PATTERNS = [
  {
    type: "悩みを解決",
    title: "最初のつまずきを解決する",
    goal: "悩みへの共感から解決策へ進める動画",
    hook: (form, p) => `${form.audience}がつまずきやすい「${p[0]}」を、短く解決します。`,
    captionLead: "最初に止まりやすいポイントを、1本にまとめました。"
  },
  {
    type: "3ステップ解説",
    title: "今日できる3ステップ",
    goal: "手順を見せて、すぐ行動できるようにする動画",
    hook: (form) => `${form.theme}は、順番を決めると一気に進めやすくなります。`,
    captionLead: "迷った時は、まずこの3ステップで進めてみてください。"
  },
  {
    type: "よくある失敗",
    title: "やりがちな失敗を避ける",
    goal: "失敗例から改善策を伝える動画",
    hook: (form) => `${form.theme}で成果が出にくい人は、この失敗をしているかもしれません。`,
    captionLead: "頑張っているのに進まない時は、やり方を少し変えるだけで変わります。"
  },
  {
    type: "比較・ビフォーアフター",
    title: "変化が伝わる比較",
    goal: "自己流と整えた後の違いを見せる動画",
    hook: (form, p) => `${p[0]}を整えるだけで、見え方と進み方が変わります。`,
    captionLead: "同じテーマでも、見せ方を変えると伝わり方が変わります。"
  },
  {
    type: "保存版まとめ",
    title: "投稿前に見るチェックリスト",
    goal: "保存して見返せる確認用の動画",
    hook: (form) => `${form.theme}で迷った時に見返せる、保存版チェックです。`,
    captionLead: "投稿前・作業前に見返せるように、必要な確認をまとめました。"
  }
];

function splitInput(text) {
  return text
    .split(/[、,。\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePoints(form) {
  const base = splitInput(form.points);
  const fallback = [
    `${form.theme}の目的を決める`,
    "届けたい相手を明確にする",
    "短い言葉で伝える",
    "投稿前に見直す",
    "反応を見て改善する"
  ];
  const values = base.length ? base : fallback;
  const points = [];
  while (points.length < 7) points.push(values[points.length % values.length]);
  return points;
}

function timeRanges(duration) {
  const total = Number(duration);
  const a = Math.max(2, Math.round(total * 0.12));
  const b = Math.round(total * 0.34);
  const c = Math.round(total * 0.58);
  const d = Math.round(total * 0.8);
  return [`0〜${a}秒`, `${a}〜${b}秒`, `${b}〜${c}秒`, `${c}〜${d}秒`, `${d}〜${total}秒`];
}

function buildScenes(form, pattern, points, index) {
  const t = timeRanges(form.duration);
  const p = points;
  const hook = pattern.hook(form, p);

  const sceneSets = [
    [
      {
        time: t[0],
        visual: `大きな見出し「${p[0]}で止まっていませんか？」を表示。背景は悩んでいる手元や作業画面風にする`,
        voice: hook,
        subtitle: `${p[0]}で止まっていませんか？`
      },
      {
        time: t[1],
        visual: `困っている状態を1つだけ見せる。情報が多くて選べない、手が止まる、投稿が作れないなどを短く表現`,
        voice: `まず多くの人が止まる理由は、やることが多く見えてしまうからです。`,
        subtitle: `止まる理由は「多く見えすぎる」こと`
      },
      {
        time: t[2],
        visual: `解決策として「${p[1]}」を中央に表示。チェックマークや矢印で迷いが整理される動きを入れる`,
        voice: `最初にやるのは「${p[1]}」。ここを決めると、次の行動が見えます。`,
        subtitle: `まずは ${p[1]}`
      },
      {
        time: t[3],
        visual: `次に「${p[2]}」を見せる。1つの例を使って、作業が進む様子をテンポよく表示`,
        voice: `次に「${p[2]}」。具体例を1つに絞ると、内容が伝わりやすくなります。`,
        subtitle: `次に ${p[2]}`
      },
      {
        time: t[4],
        visual: `最後に「今日やることは1つ」と表示し、ブランド名「${form.account}」とCTAを出す`,
        voice: `全部やろうとせず、今日ひとつだけ試してください。${form.cta}`,
        subtitle: `今日ひとつだけ試す`
      }
    ],
    [
      {
        time: t[0],
        visual: `表紙カット。「${form.theme} 3ステップ」と大きく表示し、数字1・2・3をテンポよく出す`,
        voice: hook,
        subtitle: `${form.theme} 3ステップ`
      },
      {
        time: t[1],
        visual: `STEP 1「${p[0]}」。紙やスマホにテーマを書き出すような映像`,
        voice: `ステップ1は「${p[0]}」。まず、何を伝えるかを1つに絞ります。`,
        subtitle: `STEP 1 ${p[0]}`
      },
      {
        time: t[2],
        visual: `STEP 2「${p[1]}」。届けたい相手を丸で囲む、または人物アイコンで表現`,
        voice: `ステップ2は「${p[1]}」。誰に届けるかで、言葉の選び方が変わります。`,
        subtitle: `STEP 2 ${p[1]}`
      },
      {
        time: t[3],
        visual: `STEP 3「${p[2]}」。短い文章が投稿へ変わる流れを見せる`,
        voice: `ステップ3は「${p[2]}」。短く、わかりやすく、行動につながる形にします。`,
        subtitle: `STEP 3 ${p[2]}`
      },
      {
        time: t[4],
        visual: `3つのステップが縦に並び、最後に保存アイコン風の表示とCTA`,
        voice: `この3つを順番に進めれば、今日から作り始められます。${form.cta}`,
        subtitle: `順番に進めれば大丈夫`
      }
    ],
    [
      {
        time: t[0],
        visual: `警告風ではなく柔らかい注意喚起。「これ、やっていたら要注意」と表示`,
        voice: hook,
        subtitle: `これ、やっていたら要注意`
      },
      {
        time: t[1],
        visual: `失敗1「${p[0]}を曖昧にする」。ぼんやりしたメモや散らかった画面を見せる`,
        voice: `失敗1は「${p[0]}」が曖昧なまま進めることです。`,
        subtitle: `失敗1 ${p[0]}が曖昧`
      },
      {
        time: t[2],
        visual: `失敗2「${p[1]}を後回しにする」。あとで考えるメモが積み重なる表現`,
        voice: `失敗2は「${p[1]}」を後回しにすること。ここが決まらないと迷いやすくなります。`,
        subtitle: `失敗2 ${p[1]}を後回し`
      },
      {
        time: t[3],
        visual: `改善策「${p[2]}から始める」。整理されたチェックリストへ変化する`,
        voice: `改善するなら「${p[2]}」から始めてください。小さく決めるだけで動きやすくなります。`,
        subtitle: `改善策 ${p[2]}から始める`
      },
      {
        time: t[4],
        visual: `失敗から改善へ矢印でつなぎ、最後にCTAとブランド名`,
        voice: `当てはまったら、今日の進め方を少し変えてみてください。${form.cta}`,
        subtitle: `当てはまったら見直す`
      }
    ],
    [
      {
        time: t[0],
        visual: `左右比較の画面。「Before」と「After」を並べ、変化を見せる`,
        voice: hook,
        subtitle: `Before / Afterで見る`
      },
      {
        time: t[1],
        visual: `Before側。文字が多い、目的が曖昧、見せたいことが散らばっている状態`,
        voice: `Beforeは、伝えたいことが多くて、結局何を見ればいいか分かりにくい状態です。`,
        subtitle: `Before 伝えたいことが多すぎる`
      },
      {
        time: t[2],
        visual: `After側。「${p[0]}」を軸に、見せる内容が1つに絞られている状態`,
        voice: `Afterでは「${p[0]}」を軸にします。軸があると、見せ方が整います。`,
        subtitle: `After ${p[0]}を軸にする`
      },
      {
        time: t[3],
        visual: `変化の理由として「${p[1]}」「${p[2]}」をカードで表示`,
        voice: `変化のポイントは「${p[1]}」と「${p[2]}」。この2つで伝わり方が変わります。`,
        subtitle: `${p[1]} × ${p[2]}`
      },
      {
        time: t[4],
        visual: `After画面を大きく見せ、保存を促すシンプルな締め`,
        voice: `今の見せ方を一度比べて、改善できるところを探してみてください。${form.cta}`,
        subtitle: `見せ方を比べて改善`
      }
    ],
    [
      {
        time: t[0],
        visual: `保存版の表紙。「投稿前チェック」と大きく表示。チェックボックスを3つ並べる`,
        voice: hook,
        subtitle: `投稿前チェック`
      },
      {
        time: t[1],
        visual: `チェック1「${p[0]}」。チェックボックスがオンになる動き`,
        voice: `チェック1は「${p[0]}」。最初にここが決まっているか確認します。`,
        subtitle: `□ ${p[0]}`
      },
      {
        time: t[2],
        visual: `チェック2「${p[1]}」。見出しと本文が一致しているかを示す`,
        voice: `チェック2は「${p[1]}」。見出しと内容がズレていないか見ます。`,
        subtitle: `□ ${p[1]}`
      },
      {
        time: t[3],
        visual: `チェック3「${p[2]}」。最後の行動が分かるようにCTAを強調`,
        voice: `チェック3は「${p[2]}」。見た人が次に何をすればいいかを明確にします。`,
        subtitle: `□ ${p[2]}`
      },
      {
        time: t[4],
        visual: `3つすべてにチェックが入り、保存して見返す締め画面`,
        voice: `投稿前にこの3つを見直すだけで、伝わりやすさが変わります。${form.cta}`,
        subtitle: `投稿前に3つを確認`
      }
    ]
  ];

  return { hook, scenes: sceneSets[index] };
}

function buildVideos(form) {
  const points = normalizePoints(form);
  const total = Number(form.duration);

  return VIDEO_PATTERNS.map((pattern, index) => {
    const rotated = points.slice(index).concat(points.slice(0, index));
    const { hook, scenes } = buildScenes(form, pattern, rotated, index);
    const keyPoints = rotated.slice(0, 3);
    const title = `${form.theme}｜${pattern.title}`;

    return {
      id: index + 1,
      type: pattern.type,
      title,
      hook,
      scenes,
      imagePrompt: `Codexで縦型9:16のショート動画用ビジュアルを作るための指示。動画${index + 1}は「${pattern.type}」がテーマ。対象は「${form.audience}」。${form.tone}。${keyPoints.join("、")}を視覚的に表現し、字幕が読みやすい余白を中央下から下部に確保。日本語文字を入れる場合は、各シーンの字幕と同じ短い言葉だけにする。全体は清潔感があり、スマホで見ても読める大きな文字にする。`,
      motionPrompt: `Codexで${total}秒の縦型9:16ショート動画として仕上げる指示。動画${index + 1}は「${pattern.goal}」。各カットは台本の時間配分に合わせ、シーンごとに映像の役割を変える。冒頭は強い見出し、途中は具体例やチェック、最後はCTA。過度な点滅は避け、字幕を読みやすくする。`,
      bgm: `${pattern.type}に合う、歌詞なしで軽く前向きなBGM。音声を邪魔しないようにBGMは小さめ。テンポは${form.tone}に合わせる。`,
      caption: `${hook}

${pattern.captionLead}

今回の見るポイントはこの3つです。

1. ${keyPoints[0]}
2. ${keyPoints[1]}
3. ${keyPoints[2]}

まずは全部やろうとせず、1つだけ試してみてください。

${form.cta}`,
      tags: `#${form.theme.replace(/\s/g, "")} #ショート動画 #${form.platform.includes("TikTok") ? "TikTok" : "リール"} #保存版 #初心者向け`
    };
  });
}

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem("ai-life-video-studio") || "null");
  } catch {
    return null;
  }
}

function Tool8App() {
  const [form, setForm] = React.useState(initialForm);
  const [videos, setVideos] = React.useState([]);
  const [ready, setReady] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(1);
  const [done, setDone] = React.useState([]);
  const [tab, setTab] = React.useState("script");
  const [toast, setToast] = React.useState("");

  React.useEffect(() => {
    const saved = getSavedState();
    if (!saved) return;
    setForm(saved.setup || initialForm);
    setVideos(saved.videos || []);
    setDone(saved.done || []);
    setReady(Boolean(saved.videos?.length));
  }, []);

  function save(nextVideos = videos, nextDone = done) {
    localStorage.setItem("ai-life-video-studio", JSON.stringify({ setup: form, videos: nextVideos, done: nextDone }));
  }

  function generateVideos() {
    const nextVideos = buildVideos(form);
    setVideos(nextVideos);
    setSelectedId(1);
    setDone([]);
    setReady(true);
    localStorage.setItem("ai-life-video-studio", JSON.stringify({ setup: form, videos: nextVideos, done: [] }));
  }

  async function copyText(text, message) {
    await navigator.clipboard.writeText(text);
    setToast(message);
    setTimeout(() => setToast(""), 1400);
  }

  if (!ready) {
    return h(
      "main",
      { className: "p8" },
      h(TopBar, null),
      h(
        "section",
        { className: "p8-start" },
        h(
          "div",
          null,
          h("p", { className: "p8-kicker" }, "AI SHORT VIDEO STUDIO"),
          h("h1", null, "内容が違う、", h("br"), h("em", null, "動画5本の設計図。")),
          h("p", null, "入力した内容から、ショート動画5本分の構成・台本・字幕・素材指示・投稿文を作ります。5本それぞれ違う切り口で設計します。"),
          h(
            "ol",
            null,
            h("li", null, h("b", null, "01"), h("span", null, "情報を入力", h("small", null, "テーマと届けたい相手"))),
            h("li", null, h("b", null, "02"), h("span", null, "5本分を自動設計", h("small", null, "台本・字幕・素材指示"))),
            h("li", null, h("b", null, "03"), h("span", null, "動画として仕上げる", h("small", null, "確認して投稿・完成")))
          )
        ),
        h(
          "form",
          {
            onSubmit: (event) => {
              event.preventDefault();
              generateVideos();
            }
          },
          h("p", { className: "p8-kicker" }, "VIDEO INFORMATION"),
          h("h2", null, "動画の方向性を入力"),
          h(
            "div",
            { className: "p8-two" },
            h(InputField, {
              label: "アカウント・活動名",
              required: true,
              value: form.account,
              placeholder: "例：AI LIFE",
              onChange: (account) => setForm({ ...form, account })
            }),
            h(InputField, {
              label: "動画テーマ",
              required: true,
              value: form.theme,
              placeholder: "例：初心者向けAI活用",
              onChange: (theme) => setForm({ ...form, theme })
            })
          ),
          h(InputField, {
            label: "届けたい相手",
            required: true,
            value: form.audience,
            placeholder: "例：AIを仕事に使いたい個人事業主",
            onChange: (audience) => setForm({ ...form, audience })
          }),
          h(
            "label",
            null,
            "動画で伝えたい具体的な内容",
            h("textarea", {
              required: true,
              value: form.points,
              onChange: (event) => setForm({ ...form, points: event.target.value }),
              placeholder: "例：投稿テーマ、台本、画像生成、字幕、投稿前チェック"
            }),
            h("small", null, "「、」で5つ以上に区切ると、5本の内容がよりはっきり分かれます。")
          ),
          h(
            "div",
            { className: "p8-two" },
            h(SelectField, {
              label: "動画形式",
              value: form.style,
              options: ["AI画像＋AI音声", "顔出し＋自分の声", "手元動画＋字幕", "画面収録＋解説", "AI動画＋字幕"],
              onChange: (style) => setForm({ ...form, style })
            }),
            h(SelectField, {
              label: "編集ソフト",
              value: form.editor,
              options: ["CapCut", "Premiere Pro", "まだ決めていない"],
              onChange: (editor) => setForm({ ...form, editor })
            }),
            h(SelectField, {
              label: "長さ",
              value: form.duration,
              options: [
                { value: "15", label: "15秒" },
                { value: "30", label: "30秒" },
                { value: "45", label: "45秒" },
                { value: "60", label: "60秒" }
              ],
              onChange: (duration) => setForm({ ...form, duration })
            }),
            h(SelectField, {
              label: "投稿先",
              value: form.platform,
              options: ["Instagramリール・TikTok", "Instagramリール", "TikTok", "YouTubeショート"],
              onChange: (platform) => setForm({ ...form, platform })
            })
          ),
          h(InputField, {
            label: "雰囲気",
            value: form.tone,
            onChange: (tone) => setForm({ ...form, tone })
          }),
          h(InputField, {
            label: "最後に促す行動",
            value: form.cta,
            onChange: (cta) => setForm({ ...form, cta })
          }),
          h("button", null, "ショート動画5本を設計する →"),
          h("small", null, "生成されるのは制作設計です。台本・字幕・素材指示を確認してから投稿してください。")
        )
      )
    );
  }

  const selected = videos.find((video) => video.id === selectedId) || videos[0];
  const packText = selected ? buildPackText(selected) : "";

  return h(
    "main",
    { className: "p8" },
    h(
      "header",
      { className: "p8-header" },
      h(Brand, null),
      h(
        "div",
        null,
        h("span", null, "完成 ", h("b", null, `${done.length}/5`)),
        h("i", null, h("em", { style: { width: `${done.length * 20}%` } }))
      ),
      h("button", { onClick: () => setReady(false) }, "入力を変更")
    ),
    h(
      "section",
      { className: "p8-pipeline" },
      h("b", null, "制作の流れ"),
      h("span", { className: "current" }, "1 企画・台本"),
      h("i", null, "→"),
      h("span", null, "2 素材指示"),
      h("i", null, "→"),
      h("span", null, "3 音声・編集"),
      h("i", null, "→"),
      h("span", null, "4 確認・投稿")
    ),
    selected &&
      h(
        "section",
        { className: "p8-studio" },
        h(
          "aside",
          null,
          h("p", { className: "p8-kicker" }, "YOUR 5 VIDEOS"),
          h("h2", null, "ショート動画5本"),
          h("p", null, "5本それぞれ、切り口と中身が違う構成です。"),
          videos.map((video) =>
            h(
              "button",
              {
                key: video.id,
                className: `${selectedId === video.id ? "active" : ""} ${done.includes(video.id) ? "done" : ""}`,
                onClick: () => {
                  setSelectedId(video.id);
                  setTab("script");
                }
              },
              h("i", null, done.includes(video.id) ? "✓" : String(video.id).padStart(2, "0")),
              h("span", null, h("small", null, video.type), h("b", null, video.title))
            )
          )
        ),
        h(
          "article",
          { className: "p8-work" },
          h(
            "header",
            null,
            h(
              "div",
              null,
              h("span", null, `VIDEO ${String(selected.id).padStart(2, "0")} / ${form.duration} SEC`),
              h("h1", null, selected.title),
              h("p", null, "冒頭の一言：", h("b", null, selected.hook))
            ),
            h("button", { onClick: () => copyText(packText, "制作パック全体をコピーしました") }, "すべてコピー")
          ),
          h(
            "nav",
            null,
            h("button", { className: tab === "script" ? "active" : "", onClick: () => setTab("script") }, "① 台本・カット"),
            h("button", { className: tab === "assets" ? "active" : "", onClick: () => setTab("assets") }, "② 素材を作る"),
            h("button", { className: tab === "edit" ? "active" : "", onClick: () => setTab("edit") }, "③ 編集する"),
            h("button", { className: tab === "post" ? "active" : "", onClick: () => setTab("post") }, "④ 投稿する")
          ),
          tab === "script" && h(ScriptPanel, { video: selected, copyText }),
          tab === "assets" && h(AssetsPanel, { video: selected, copyText }),
          tab === "edit" && h(EditPanel, { form, video: selected, copyText }),
          tab === "post" && h(PostPanel, { video: selected, done, setDone, videos, save, copyText })
        )
      ),
    toast && h("div", { className: "p8-toast" }, toast, " ✓")
  );
}

function ScriptPanel({ video, copyText }) {
  return h(
    "div",
    { className: "p8-panel" },
    h("div", { className: "p8-instruction" }, h("b", null, "この画面でやること"), h("p", null, "下の順番でカットを作ります。映像・音声・字幕は1本ごとに違う内容です。")),
    video.scenes.map((scene, index) =>
      h(
        "section",
        { className: "p8-scene", key: `${scene.time}-${scene.subtitle}` },
        h("b", null, scene.time),
        h(
          "div",
          null,
          h("small", null, `SCENE ${index + 1}`),
          h("h3", null, scene.visual),
          h("p", null, h("span", null, "音声"), scene.voice),
          h("p", null, h("span", null, "字幕"), scene.subtitle)
        ),
        h("button", { onClick: () => copyText(`映像：${scene.visual}\n音声：${scene.voice}\n字幕：${scene.subtitle}`, `${index + 1}カット目をコピーしました`) }, "コピー")
      )
    ),
    h("button", { className: "p8-copy", onClick: () => copyText(video.scenes.map(formatScene).join("\n\n"), "台本をコピーしました") }, "台本全体をコピー")
  );
}

function AssetsPanel({ video, copyText }) {
  return h(
    "div",
    { className: "p8-panel" },
    h("div", { className: "p8-instruction" }, h("b", null, "素材を作る"), h("p", null, "画像・動画素材を作る時に使う指示です。各動画ごとに目的と見せ方を変えています。")),
    h(
      "section",
      { className: "p8-box" },
      h("span", null, "VISUAL PROMPT"),
      h("h2", null, "画像・サムネイル素材の指示"),
      h("p", null, video.imagePrompt),
      h("button", { onClick: () => copyText(video.imagePrompt, "画像生成指示をコピーしました") }, "画像指示をコピー")
    ),
    h(
      "section",
      { className: "p8-box dark" },
      h("span", null, "MOTION PROMPT"),
      h("h2", null, "動画にする指示"),
      h("p", null, video.motionPrompt),
      h("button", { onClick: () => copyText(video.motionPrompt, "動画指示をコピーしました") }, "動画指示をコピー")
    ),
    h("aside", null, h("b", null, "素材の確認"), h("p", null, "文字切れ、誤字、人物や権利関係、不自然な表現がないか確認してください。"))
  );
}

function EditPanel({ form, video, copyText }) {
  return h(
    "div",
    { className: "p8-panel" },
    h("div", { className: "p8-instruction" }, h("b", null, `${form.editor}で仕上げる`), h("p", null, "素材を読み込み、以下の順番で編集します。")),
    h(
      "ol",
      { className: "p8-steps" },
      h("li", null, h("b", null, "1"), h("span", null, `縦型9:16、${form.duration}秒の新規プロジェクトを作る`)),
      h("li", null, h("b", null, "2"), h("span", null, "台本の時間配分に合わせて、各カットの役割が分かるように並べる")),
      h("li", null, h("b", null, "3"), h("span", null, "音声原稿を自分で録音、または音声生成用にコピーして使う"), h("button", { onClick: () => copyText(video.scenes.map((scene) => scene.voice).join("\n"), "音声原稿をコピーしました") }, "音声原稿をコピー")),
      h("li", null, h("b", null, "4"), h("span", null, "字幕は1行15文字前後にして、画面下端から離して配置"), h("button", { onClick: () => copyText(video.scenes.map((scene) => scene.subtitle).join("\n"), "字幕をコピーしました") }, "字幕をコピー")),
      h("li", null, h("b", null, "5"), h("span", null, video.bgm)),
      h("li", null, h("b", null, "6"), h("span", null, "1080×1920、MP4で書き出し、スマートフォンで全編を確認"))
    )
  );
}

function PostPanel({ video, done, setDone, videos, save, copyText }) {
  return h(
    "div",
    { className: "p8-panel" },
    h("div", { className: "p8-instruction" }, h("b", null, "最終確認して投稿"), h("p", null, "事実・権利・個人情報・字幕切れ・音量を人が確認してから投稿します。")),
    h(
      "section",
      { className: "p8-box" },
      h("span", null, "POST CAPTION"),
      h("h2", null, "投稿文"),
      h("pre", null, video.caption, "\n\n", video.tags),
      h("button", { onClick: () => copyText(`${video.caption}\n\n${video.tags}`, "投稿文をコピーしました") }, "投稿文をコピー")
    ),
    h(
      "div",
      { className: "p8-check" },
      h("span", null, "□ 内容の事実確認"),
      h("span", null, "□ 素材・音楽の利用権確認"),
      h("span", null, "□ 個人情報が映っていない"),
      h("span", null, "□ 音声と字幕を確認")
    ),
    h(
      "button",
      {
        className: `p8-finish ${done.includes(video.id) ? "done" : ""}`,
        onClick: () => {
          const nextDone = done.includes(video.id) ? done.filter((id) => id !== video.id) : [...done, video.id];
          setDone(nextDone);
          save(videos, nextDone);
        }
      },
      done.includes(video.id) ? "この動画は完成済み ✓" : "投稿できたら「完成」にする"
    )
  );
}

function buildPackText(video) {
  return `タイトル：${video.title}

台本
${video.scenes.map(formatScene).join("\n\n")}

画像・素材指示
${video.imagePrompt}

動画指示
${video.motionPrompt}

BGM
${video.bgm}

投稿文
${video.caption}
${video.tags}`;
}

function formatScene(scene) {
  return `【${scene.time}】
映像：${scene.visual}
音声：${scene.voice}
字幕：${scene.subtitle}`;
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

function SelectField({ label, value, options, onChange }) {
  return h(
    "label",
    null,
    label,
    h(
      "select",
      { value, onChange: (event) => onChange(event.target.value) },
      options.map((option) => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        return h("option", { key: item.value, value: item.value }, item.label);
      })
    )
  );
}

function TopBar() {
  return h("header", { className: "topbar" }, h(Brand, null), h("span", { className: "chapter-pill" }, "第8章 成果物ワーク"));
}

function Brand() {
  return h(
    "a",
    { className: "brand", href: "/" },
    h("span", { className: "brandmark" }, "AI"),
    h("span", null, h("b", null, "あいらいふ"), h("small", null, "AI LIFE ACADEMY"))
  );
}

export default function Tool8() {
  return h(Tool8App);
}
