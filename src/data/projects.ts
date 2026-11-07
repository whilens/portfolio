export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
  features: string[];
  summary: string;
  video?: string;
  poster: string;
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "arrow",
    title: "Arrow",
    client: "Яхтенный бренд",
    year: "2024",
    tags: ["Многостраничник", "GSAP pin", "Splide"],
    features: [
      "Полноэкранные секции, которые стыкуются на скролле",
      "Карусели услуг и отзывов",
      "Смена темы CTA при переходе между блоками",
    ],
    summary:
      "Многостраничный сайт с закреплёнными панелями: услуги, поддержка и отзывы читаются как последовательная презентация бренда.",
    video: "/videos/arrow.webm",
    poster: "/posters/arrow.png",
    accent: "#7C9BFF",
  },
  {
    slug: "avantage",
    title: "Avantage",
    client: "Натяжные потолки",
    year: "2024",
    tags: ["Лендинг", "Каталог", "Видео"],
    features: [
      "Карточки типов потолков с появлением при скролле",
      "Ленты материалов и отзывов",
      "Двуязычная витрина",
    ],
    summary:
      "Коммерческий лендинг с каталогом фактур и мягким fade-up: товар виден сразу, заявка — в двух кликах.",
    video: "/videos/avantage.mp4",
    poster: "/posters/avantage.png",
    accent: "#C9A36A",
  },
  {
    slug: "stroy",
    title: "Строй Подряд",
    client: "B2B строительство",
    year: "2024",
    tags: ["Лидогенерация", "Аккордеон", "Кейсы"],
    features: [
      "Аккордеон компетенций",
      "Лента заказчиков и кейсов",
      "Форма заявки с валидацией",
    ],
    summary:
      "B2B-сайт для подрядчика: этапы, навыки и кейсы собраны так, чтобы квалификация читалась без лишней воды.",
    video: "/videos/stroy.webm",
    poster: "/posters/stroy.png",
    accent: "#3D7A4A",
  },
  {
    slug: "maymin",
    title: "Progresco",
    client: "Инжиниринг завода",
    year: "2025",
    tags: ["Fullpage", "3D", "B2B"],
    features: [
      "Боковая пагинация экранов с именами секций",
      "Кнопка, которая следует за курсором",
      "Презентация функционала и 3D-модели",
    ],
    summary:
      "Промышленный лендинг с покадровой навигацией: каждое решение завода — отдельный экран с собственной точкой входа.",
    video: "/videos/progresco.webm",
    poster: "/posters/maymin.png",
    accent: "#D75B3B",
  },
  {
    slug: "rumtibet",
    title: "Румтибет",
    client: "Туристический маршрут",
    year: "2024",
    tags: ["Лендинг", "Swiper", "Галерея"],
    features: [
      "Карточки программы тура",
      "Галерея маршрута",
      "Блок стоимости и гида",
    ],
    summary:
      "Туристический лендинг, где маршрут рассказывается слайдами: атмосфера места важнее таблицы услуг.",
    video: "/videos/rumtibet.webm",
    poster: "/posters/rumtibet.png",
    accent: "#E8C17A",
  },
  {
    slug: "braas",
    title: "Braas",
    client: "Карточки товаров / ЛК",
    year: "2024",
    tags: ["UI-kit", "Hover", "E-commerce"],
    features: [
      "Hover карточек с поворотом и масштабом",
      "Градиентные акценты лояльности",
      "Сценарии корзины и бонусов",
    ],
    summary:
      "Референс интерфейса магазина: карточка товара оживает при наведении и сразу показывает характер бренда.",
    video: "/videos/braas.mp4",
    poster: "/posters/braas.png",
    accent: "#C084FC",
  },
  {
    slug: "vr",
    title: "VR Events",
    client: "VR-ивенты",
    year: "2024",
    tags: ["Reveal", "Тёмная сцена", "Ивенты"],
    features: [
      "Появление блоков слева и снизу",
      "Пульсирующие круги-акценты",
      "Липкий header с размытием",
    ],
    summary:
      "Тёмный лендинг ивентов: элементы входят в кадр по скроллу и собирают сцену, а не просто список услуг.",
    video: "/videos/vr.webm",
    poster: "/posters/vr.png",
    accent: "#A78BFA",
  },
  {
    slug: "southpark",
    title: "Южный парк",
    client: "Жилой комплекс",
    year: "2024",
    tags: ["Scroll-story", "Pin + zoom", "Недвижимость"],
    features: [
      "Закреплённый кадр с зумом",
      "Смена смыслов на одном экране",
      "Светлая палитра как пауза среди тёмного сайта",
    ],
    summary:
      "Scroll-storytelling ЖК: изображение дома растёт вместе со скроллом и держит внимание на атмосфере квартала.",
    video: "/videos/southpark.webm",
    poster: "/posters/southpark.png",
    accent: "#5B7C5A",
  },
];

export const servicesMarquee = [
  "Сайты-визитки",
  "Интернет-магазины",
  "Мобильные приложения",
  "ИИ-консультанты",
  "Админ-панели",
  "Микросервисы",
];
