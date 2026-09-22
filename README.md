# Личный сайт Хаси Абдуллаха

Локальный интерактивный прототип одностраничного документального сайта. Это не публичная публикация и не утверждение каждого текста или визуального материала. Главная идея: **«Несколько направлений. Один принцип: польза.»**

## Старт на Windows / Surface

Нужны уже установленный Node.js и Python. Никакие пакеты устанавливать не требуется.

```powershell
cd 'C:\Vibe Codding\Codex\Личный лендинг'
npm run preview
```

Откройте [http://localhost:4173/](http://localhost:4173/). Остановить сервер: `Ctrl+C` в том же PowerShell-окне.

Если сервер уже запущен, после изменения контента достаточно выполнить:

```powershell
npm run build
npm run check
```

## Структура

```text
assets/images/          разрешённые изображения
src/content/sections/   по одному HTML-файлу на секцию (hero, valerik, book, …)
src/styles/sections/    парный CSS каждой секции — то же имя, адаптив внутри
src/styles/components/  повторно используемые элементы: header, button, disclosure…
src/js/modules/         независимые интерактивные сценарии
src/templates/          шаблон, который собирает index.html и задаёт порядок секций
scripts/                zero-dependency build и проверка
docs/                   решения, факты, материалы, QA и план
```

Ни один файл исходников не длиннее 150 строк — `npm run check` следит за этим.

`index.html` — сгенерированная entry point для preview и будущего статического хостинга. Правьте `src/`, затем запускайте `npm run build`.

## Команды

| Команда | Что делает |
| --- | --- |
| `npm run build` | собирает `index.html` из фрагментов |
| `npm run check` | проверяет обязательные файлы, внутренние якоря и точки входа |
| `npm run preview` | build + локальный сервер на 4173 |

`package.json` не содержит runtime или development dependencies: это удобный интерфейс нативных команд Node/Python, а не зависимая сборка.

## Где менять

- Текст секции: `src/content/sections/<имя>.html`; порядок секций — `src/templates/page.html`.
- Meta/SEO-заголовок: `src/content/head.html`.
- Поведение: `src/js/modules/`.
- Вид секции: `src/styles/sections/<имя>.css`; общие элементы — `src/styles/components/`; цвета и шрифты — `src/styles/tokens.css`.
- Фото: `assets/images/` и сразу запись в `docs/MATERIALS.md`.
- Факты и статусы: сначала `docs/FACTS-AND-OPEN-QUESTIONS.md`, затем HTML.

## Правила работы

- Не редактируйте `index.html` вручную.
- Не добавляйте библиотеки, формы, трекеры или внешние сервисы без отдельной необходимости и записи в `docs/DECISIONS.md`.
- Не добавляйте непроверенные ссылки, контакты, достижения, даты, изображения или медиа-логотипы.
- Коллективные инициативы Валерика не приписывайте одному человеку; HurmaN не называйте открытым.

Полные правила: [AGENTS.md](AGENTS.md), [CONTRIBUTING.md](CONTRIBUTING.md), [карта документации](docs/DOCUMENTATION-INDEX.md) и [текущий статус](PROJECT-STATUS.md).

## Будущий деплой и SEO

Пока нет публичного домена, поэтому не добавлены canonical URL, sitemap, robots и Open Graph image. После выбора домена сделайте это по чеклисту из `docs/QA-CHECKLIST.md`; GitHub-публикация и внешний хостинг не входят в текущий этап.
