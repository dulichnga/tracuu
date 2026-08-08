/* Vành đai & tuyến du lịch Nga. type: "ring" (vòng khép kín) | "route" (tuyến dài, đường thẳng).
   on:false = mặc định tắt (bật bằng ô tích ở thanh bên). Thêm mới chỉ cần thêm 1 khối vào mảng. */
window.RUSSIA_RINGS = [
  {
    id: "golden", type: "ring", on: true, color: "#e0a51f",
    vi: "Vành đai Vàng", en: "Golden Ring", ru: "Золотое кольцо",
    sub_vi: "quanh Moskva", sub_en: "around Moscow", sub_ru: "вокруг Москвы",
    hub: { vi: "Moskva", en: "Moscow", ru: "Москва", lat: 55.7558, lon: 37.6176 },
    cities: [
      { vi: "Sergiev Posad", en: "Sergiev Posad", ru: "Сергиев Посад", lat: 56.3153, lon: 38.1301 },
      { vi: "Pereslavl-Zalessky", en: "Pereslavl-Zalessky", ru: "Переславль-Залесский", lat: 56.7386, lon: 38.8566 },
      { vi: "Rostov Veliky", en: "Rostov the Great", ru: "Ростов Великий", lat: 57.1856, lon: 39.4143 },
      { vi: "Yaroslavl", en: "Yaroslavl", ru: "Ярославль", lat: 57.6261, lon: 39.8845 },
      { vi: "Kostroma", en: "Kostroma", ru: "Кострома", lat: 57.7665, lon: 40.9269 },
      { vi: "Plyos", en: "Plyos", ru: "Плёс", lat: 57.4603, lon: 41.5147 },
      { vi: "Ivanovo", en: "Ivanovo", ru: "Иваново", lat: 57.0004, lon: 40.9739 },
      { vi: "Suzdal", en: "Suzdal", ru: "Суздаль", lat: 56.4194, lon: 40.4522 },
      { vi: "Vladimir", en: "Vladimir", ru: "Владимир", lat: 56.1288, lon: 40.4070 }
    ]
  },
  {
    id: "silver", type: "ring", on: true, color: "#5b8fb9",
    vi: "Vành đai Bạc", en: "Silver Ring", ru: "Серебряное кольцо",
    sub_vi: "quanh Saint Petersburg", sub_en: "around Saint Petersburg", sub_ru: "вокруг Санкт-Петербурга",
    hub: { vi: "Saint Petersburg", en: "Saint Petersburg", ru: "Санкт-Петербург", lat: 59.9391, lon: 30.3159 },
    cities: [
      { vi: "Vyborg", en: "Vyborg", ru: "Выборг", lat: 60.7139, lon: 28.7539 },
      { vi: "Priozersk", en: "Priozersk", ru: "Приозёрск", lat: 61.0353, lon: 30.1264 },
      { vi: "Staraya Ladoga", en: "Staraya Ladoga", ru: "Старая Ладога", lat: 59.9989, lon: 32.2969 },
      { vi: "Tikhvin", en: "Tikhvin", ru: "Тихвин", lat: 59.6436, lon: 33.5092 },
      { vi: "Veliky Novgorod", en: "Veliky Novgorod", ru: "Великий Новгород", lat: 58.5215, lon: 31.2755 },
      { vi: "Pskov", en: "Pskov", ru: "Псков", lat: 57.8194, lon: 28.3495 },
      { vi: "Izborsk", en: "Izborsk", ru: "Изборск", lat: 57.7086, lon: 27.8622 },
      { vi: "Pechory", en: "Pechory", ru: "Печоры", lat: 57.8144, lon: 27.6144 },
      { vi: "Ivangorod", en: "Ivangorod", ru: "Ивангород", lat: 59.3747, lon: 28.2119 }
    ]
  },
  {
    id: "bosporus", type: "route", on: false, color: "#c56a2c",
    vi: "Vành đai Vàng Bosporus", en: "Golden Ring of the Bosporan Kingdom", ru: "Золотое кольцо Боспорского царства",
    sub_vi: "cổ đại Hy Lạp — Nam Nga & Crimea", sub_en: "ancient Greek — S. Russia & Crimea", sub_ru: "древнегреческий — юг России и Крым",
    cities: [
      { vi: "Yevpatoria", en: "Yevpatoria", ru: "Евпатория", lat: 45.1900, lon: 33.3669 },
      { vi: "Sevastopol", en: "Sevastopol", ru: "Севастополь", lat: 44.6167, lon: 33.5254 },
      { vi: "Simferopol", en: "Simferopol", ru: "Симферополь", lat: 44.9521, lon: 34.1024 },
      { vi: "Feodosia", en: "Feodosia", ru: "Феодосия", lat: 45.0319, lon: 35.3824 },
      { vi: "Kerch", en: "Kerch", ru: "Керчь", lat: 45.3531, lon: 36.4742 },
      { vi: "Taman", en: "Taman", ru: "Тамань", lat: 45.2114, lon: 36.7164 },
      { vi: "Anapa", en: "Anapa", ru: "Анапа", lat: 44.8938, lon: 37.3162 },
      { vi: "Novorossiysk", en: "Novorossiysk", ru: "Новороссийск", lat: 44.7239, lon: 37.7686 },
      { vi: "Gelendzhik", en: "Gelendzhik", ru: "Геленджик", lat: 44.5622, lon: 38.0773 },
      { vi: "Azov", en: "Azov", ru: "Азов", lat: 47.1128, lon: 39.4232 }
    ]
  },
  {
    id: "transsib", type: "route", on: false, color: "#c0392b",
    vi: "Đường sắt xuyên Siberia", en: "Trans-Siberian Railway", ru: "Транссибирская магистраль",
    sub_vi: "Moskva → Vladivostok (~9.300 km)", sub_en: "Moscow → Vladivostok", sub_ru: "Москва → Владивосток",
    cities: [
      { vi: "Moskva", en: "Moscow", ru: "Москва", lat: 55.7558, lon: 37.6176 },
      { vi: "Nizhny Novgorod", en: "Nizhny Novgorod", ru: "Нижний Новгород", lat: 56.3269, lon: 44.0059 },
      { vi: "Yekaterinburg", en: "Yekaterinburg", ru: "Екатеринбург", lat: 56.8389, lon: 60.6057 },
      { vi: "Omsk", en: "Omsk", ru: "Омск", lat: 54.9885, lon: 73.3242 },
      { vi: "Novosibirsk", en: "Novosibirsk", ru: "Новосибирск", lat: 55.0084, lon: 82.9357 },
      { vi: "Krasnoyarsk", en: "Krasnoyarsk", ru: "Красноярск", lat: 56.0153, lon: 92.8932 },
      { vi: "Irkutsk", en: "Irkutsk", ru: "Иркутск", lat: 52.2870, lon: 104.2810 },
      { vi: "Ulan-Ude", en: "Ulan-Ude", ru: "Улан-Удэ", lat: 51.8335, lon: 107.5841 },
      { vi: "Chita", en: "Chita", ru: "Чита", lat: 52.0340, lon: 113.4994 },
      { vi: "Khabarovsk", en: "Khabarovsk", ru: "Хабаровск", lat: 48.4827, lon: 135.0838 },
      { vi: "Vladivostok", en: "Vladivostok", ru: "Владивосток", lat: 43.1155, lon: 131.8855 }
    ]
  },
  {
    id: "bam", type: "route", on: false, color: "#1f9e6a",
    vi: "Đường sắt BAM (Baikal–Amur)", en: "Baikal–Amur Mainline (BAM)", ru: "Байкало-Амурская магистраль",
    sub_vi: "Taishet → Sovetskaya Gavan", sub_en: "Taishet → Sovetskaya Gavan", sub_ru: "Тайшет → Советская Гавань",
    cities: [
      { vi: "Taishet", en: "Taishet", ru: "Тайшет", lat: 55.9350, lon: 98.0074 },
      { vi: "Bratsk", en: "Bratsk", ru: "Братск", lat: 56.1514, lon: 101.6344 },
      { vi: "Ust-Kut", en: "Ust-Kut", ru: "Усть-Кут", lat: 56.7928, lon: 105.7699 },
      { vi: "Severobaikalsk", en: "Severobaikalsk", ru: "Северобайкальск", lat: 55.6353, lon: 109.3406 },
      { vi: "Tynda", en: "Tynda", ru: "Тында", lat: 55.1544, lon: 124.7245 },
      { vi: "Komsomolsk-na-Amure", en: "Komsomolsk-on-Amur", ru: "Комсомольск-на-Амуре", lat: 50.5499, lon: 137.0079 },
      { vi: "Sovetskaya Gavan", en: "Sovetskaya Gavan", ru: "Советская Гавань", lat: 48.9706, lon: 140.2870 }
    ]
  },
  {
    id: "volga", type: "route", on: false, color: "#0e8ea3",
    vi: "Tuyến sông Volga", en: "Volga River Route", ru: "Волжский круиз",
    sub_vi: "du thuyền Moskva → Astrakhan", sub_en: "cruise Moscow → Astrakhan", sub_ru: "круиз Москва → Астрахань",
    cities: [
      { vi: "Moskva", en: "Moscow", ru: "Москва", lat: 55.7558, lon: 37.6176 },
      { vi: "Uglich", en: "Uglich", ru: "Углич", lat: 57.5225, lon: 38.3320 },
      { vi: "Yaroslavl", en: "Yaroslavl", ru: "Ярославль", lat: 57.6261, lon: 39.8845 },
      { vi: "Nizhny Novgorod", en: "Nizhny Novgorod", ru: "Нижний Новгород", lat: 56.3269, lon: 44.0059 },
      { vi: "Kazan", en: "Kazan", ru: "Казань", lat: 55.7963, lon: 49.1088 },
      { vi: "Ulyanovsk", en: "Ulyanovsk", ru: "Ульяновск", lat: 54.3142, lon: 48.4031 },
      { vi: "Samara", en: "Samara", ru: "Самара", lat: 53.1959, lon: 50.1002 },
      { vi: "Saratov", en: "Saratov", ru: "Саратов", lat: 51.5330, lon: 46.0342 },
      { vi: "Volgograd", en: "Volgograd", ru: "Волгоград", lat: 48.7080, lon: 44.5133 },
      { vi: "Astrakhan", en: "Astrakhan", ru: "Астрахань", lat: 46.3479, lon: 48.0336 }
    ]
  },
  {
    id: "redroute", type: "route", on: false, color: "#9b3fbf",
    vi: "Tuyến Đỏ", en: "Red Route", ru: "Красный маршрут",
    sub_vi: "di sản cách mạng", sub_en: "revolutionary heritage", sub_ru: "революционное наследие",
    cities: [
      { vi: "Moskva", en: "Moscow", ru: "Москва", lat: 55.7558, lon: 37.6176 },
      { vi: "Ulyanovsk", en: "Ulyanovsk", ru: "Ульяновск", lat: 54.3142, lon: 48.4031 },
      { vi: "Kazan", en: "Kazan", ru: "Казань", lat: 55.7963, lon: 49.1088 },
      { vi: "Saint Petersburg", en: "Saint Petersburg", ru: "Санкт-Петербург", lat: 59.9391, lon: 30.3159 }
    ]
  }
];
