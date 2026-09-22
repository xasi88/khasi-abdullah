# Архитектура проекта

## Подход

Проект остаётся статическим: HTML, CSS и нативные ES-модули без framework, bundler и runtime-зависимостей. Это осознанный выбор: текущему прототипу не нужны маршрутизация, сервер, база данных или сложная сборка. Node.js используется только для маленького локального сборщика HTML-фрагментов и проверок.

## Дерево

```text
Личный лендинг/
├── index.html                 # сгенерированная точка входа для preview/деплоя
├── assets/images/             # разрешённые визуальные материалы
│   └── media/                 # 20 обложек видео и рилсов, источники — в docs/MATERIALS.md
├── src/
│   ├── content/
│   │   ├── head.html, header.html, footer.html
│   │   └── sections/          # один файл — одна секция страницы (14 файлов)
│   │       ├── hero, metrics, history          # начало и контекст
│   │       ├── valerik, sport, book, hurman    # дела и книга
│   │       ├── worldview, work, digital        # взгляд, практика, цифровые проекты
│   │       └── timeline, media, now, contact   # хронология, голос, сейчас, связь
│   ├── js/
│   │   ├── main.js            # подключает поведение
│   │   └── modules/           # menu, timeline, clipboard, reading-progress, active-navigation, video-embed
│   ├── styles/
│   │   ├── main.css           # точка входа: порядок слоёв и @import
│   │   ├── tokens.css         # цвета, шрифты, контейнер
│   │   ├── base.css           # reset, типографика, глобальный адаптив, reduced motion
│   │   ├── components/        # повторно используемые элементы: header, button, disclosure, print, slot…
│   │   └── sections/          # стили секций — имена совпадают с content/sections/
│   └── templates/page.html    # шаблон: порядок секций задаётся include-директивами
├── scripts/
│   ├── build.mjs              # собирает index.html из src/content
│   └── verify.mjs             # проверяет ссылки, точки входа, «осиротевшие» и слишком длинные файлы
├── docs/                      # правила, факты, QA и планы
├── archive/                   # снимки прежних версий дизайна (zip), не участвуют в сборке
├── PROJECT-STATUS.md          # быстрый вход в проект
├── AGENTS.md                  # рабочие ограничения для AI-агента
└── package.json               # только команды без dependencies
```

## Правила структуры

- **Одна секция — три парных файла с одним именем:** `content/sections/valerik.html`, `styles/sections/valerik.css` (при необходимости — модуль в `js/modules/`). Порядок секций на странице задаёт только `templates/page.html`; числовые префиксы в именах файлов не нужны.
- **Адаптив лежит рядом с правилами, которые он меняет:** в конце каждого CSS-файла — блоки `@media (max-width: 860px)` и `@media (max-width: 600px)`. Общий адаптив (контейнер, заголовки, отступы секций, reduced motion) — в конце `base.css`.
- **Слои CSS:** `tokens → base → components → sections`. Секции сильнее компонентов, компоненты сильнее базы.
- **Лимит — 150 строк на файл.** `npm run check` падает, если файл в `src/` или `scripts/` длиннее; разделяйте по смыслу, а не по числу строк.
- **Ничего не «висит в воздухе»:** каждый файл секции должен быть подключён в `page.html`, каждый CSS — в `main.css`, каждый модуль — в `main.js`; иначе `npm run check` сообщит об этом.
- Цепочка `@import` в CSS удобна для разработки. Перед публикацией на хостинг CSS стоит склеить в один файл (см. `NEXT-STEPS.md`, этап 4).

## Поток работы

1. Редактируйте фрагмент в `src/content/sections/`, парный CSS в `src/styles/sections/` или JS-модуль.
2. Запустите `npm run build` — он обновит `index.html`.
3. Запустите `npm run check`.
4. Откройте `http://localhost:4173/` через `npm run preview` или `python -m http.server 4173` после build.

`index.html` — build-артефакт, но намеренно хранится в проекте: его можно сразу открыть на статическом хостинге без дополнительного сервиса. Не редактируйте его вручную.

## Почему есть package.json, но нет зависимостей

`package.json` нужен только как единый интерфейс команд `build`, `check` и `preview` на Windows. В нём нет `dependencies`, `devDependencies` и lockfile: ничего не требуется устанавливать для сайта или его проверки.

## Где добавлять новое

- Новая секция: `src/content/sections/<имя>.html` + `src/styles/sections/<имя>.css`, затем include в `src/templates/page.html` и `@import` в `src/styles/main.css`.
- Новый повторяющийся элемент (кнопка, карточка, метка): файл в `src/styles/components/`, `@import` в `main.css`.
- Новое интерактивное поведение: отдельный модуль в `src/js/modules/`, импорт в `src/js/main.js`.
- Адаптив: в тот же CSS-файл, ниже базовых правил.
- Изображение или обложка видео: `assets/images/` (медиа — в `media/`), строка с источником и датой в `MATERIALS.md`, осмысленный `alt` (для обложек внутри карточки `clip` — пустой `alt` и подпись на кнопке или ссылке).
- Новое YouTube-видео: карточка `clip` с `button[data-video-id]` (образец — `sections/sport.html`); Instagram: карточка `clip clip--tall` со ссылкой.

Перед добавлением новых фактов сверяйтесь с `FACTS-AND-OPEN-QUESTIONS.md`.
