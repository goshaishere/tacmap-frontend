# TacMap — Тактическая карта и командный портал

![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen?logo=vue.js)
![Vite 7](https://img.shields.io/badge/Vite-7-blueviolet?logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-3-yellow?logo=pinia)
![Vuetify 3](https://img.shields.io/badge/Vuetify-3-blue?logo=vuetify)
![Yandex Maps](https://img.shields.io/badge/Yandex%20Maps-JS%20API%202.1-red?logo=yandex)
![i18n](https://img.shields.io/badge/i18n-ru%20%7C%20en-green)

Веб-приложение для тактического планирования и командной работы: карта с метками, канбан задач, сообщения, профиль и гибкая иерархия (военная / корпоративная). Поддерживает светлую и тёмную тему и кастомные цвета.

---

## О проекте

TacMap объединяет:

- **Карту** — Яндекс.Карты, метки разных типов, контекстное меню, привязка задач к точкам
- **Задачи** — канбан-доска, создание/редактирование задач, типы по ролям и должностям, выбор исполнителя и отдела/команды
- **Сообщения** — раздел переписок с списком диалогов и чатом
- **Профиль и настройки** — компания, тип иерархии (военная/корпоративная), тема (светлая/тёмная и кастомная палитра), язык (ru/en)

Иерархия переключается между **военным** (фракция → сквад, роли) и **корпоративным** (отдел → команда, должности) режимом; настройки сохраняются в `localStorage` отдельно для каждого типа.

---

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone <url-репозитория>
cd frontend
npm install
```

### 2. Переменные окружения

Скопируй `.env.example` в `.env` и укажи API-ключ Яндекс.Карт:

```bash
cp .env.example .env
```

В `.env`:

```env
VITE_YANDEX_MAPS_API_KEY=твой_ключ
```

Ключ можно получить на [developer.tech.yandex.ru](https://developer.tech.yandex.ru/services/).

### 3. Запуск

```bash
npm run dev
```

Открой в браузере адрес, который покажет Vite (обычно `http://localhost:5173`).

---

## Основные возможности

| Раздел | Описание |
|--------|----------|
| **Карта** | Интерактивная карта (vue-yandex-maps), правый клик — контекстное меню, создание/редактирование меток, типы: атака, защита, укрепление, снайпер, мина и др. Метки и настройки карты сохраняются (Pinia + localStorage). |
| **Задачи** | Канбан по статусам, карточки с приоритетом/дедлайном/исполнителем, перетаскивание (vuedraggable), форма создания с привязкой к ролям/должностям и к метке на карте. |
| **Сообщения** | Список диалогов и чат; интерфейс вынесен в i18n. |
| **Профиль** | Данные пользователя, привязка к иерархии (фракция/сквад или отдел/команда, роль/должность). |
| **Настройки** | Общие настройки, **Компания** (тип иерархии, структура, сотрудники), **Тема** (светлая/тёмная, кастомные цвета через оверлей). |
| **Помощь** | Страница справки (`/help`). |

Дополнительно:

- **Локализация ru/en** (vue-i18n), выбор языка в настройках, сохранение в `localStorage` (`appLocale`)
- **Темы**: встроенные тактические светлая/тёмная + пользовательская палитра (см. `src/utils/themeOverlay.js`, `src/config/themeDefaults.js`)
- **Авторизация**: логин/регистрация, защищённые маршруты (Pinia store `auth`)

---

## Технологии

| Категория | Стек |
|-----------|------|
| Фреймворк | Vue 3, Vue Router 4 |
| Сборка | Vite 7 |
| Состояние | Pinia |
| UI | Vuetify 3, SASS, MDI, Lucide Vue |
| Карта | vue-yandex-maps (Yandex Maps API 2.1) |
| Локализация | vue-i18n |
| Канбан | vuedraggable |
| Другое | canvas (генерация маркеров) |

---

## Структура проекта

```
frontend/
├── public/                 # Статика (иконки, звуки)
├── scripts/                # Скрипты (например, generate-all-markers.cjs)
├── src/
│   ├── App.vue             # Корень приложения, выбор layout, тема
│   ├── main.js             # Точка входа, Vuetify, Pinia, i18n, Yandex Maps
│   ├── router.js           # Маршруты и guard по авторизации
│   ├── routes.js           # Определение страниц
│   ├── i18n.js             # vue-i18n, ru/en, сохранение локали
│   ├── config/             # themeDefaults, yandex-maps
│   ├── composables/        # useMarkerBalloon и др.
│   ├── data/               # Схема, роли, ранги, отделы, команды, типы меток и т.д.
│   ├── layouts/            # MainLayout, AuthLayout, MessagesLayout
│   ├── locales/            # ru.js, en.js
│   ├── pages/              # Home, Map, Tasks, Messages, Profile, Settings, ThemeSettings, CompanySettings, Help, Login, Register, NotFound
│   ├── components/         # Карта, метки, задачи, сообщения, компания (StructureNode), RoleActions и др.
│   ├── store/              # auth, company, map, messages, profile, tasks
│   ├── styles/             # Глобальные стили, переменные, миксины, модульные SCSS
│   ├── types/              # app.d.ts (TypeScript-типы для приложения)
│   └── utils/              # themeOverlay, generateMarkers, taskUtils
├── docs/                   # Документация (например, PIPELINE_CORPORATE.md)
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

---

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_YANDEX_MAPS_API_KEY` | API-ключ Яндекс.Карт (обязателен для карты). |

Секреты и ключи хранить только в `.env`; в репозиторий не коммитить.

---

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Просмотр прод-сборки |

---

## Документация

- [docs/PIPELINE_CORPORATE.md](docs/PIPELINE_CORPORATE.md) — пайплайн перехода к корпоративному сценарию: иерархия, канбан, задачи, i18n, чек-лист реализации.

---

## Лицензия

MIT. Используй, дорабатывай, делись с командой.

---

**TacMap — карта, задачи и команда в одном месте.**
