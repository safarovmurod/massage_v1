/* ============================================
   i18n — 3 languages: RU / TJ / EN
   ============================================ */

const translations = {
  ru: {
    // Header
    'nav.home': 'Главная',
    'nav.benefits': 'Преимущества',
    'nav.process': 'Как проходит массаж',
    'nav.prices': 'Цены',
    'nav.contacts': 'Контакты',
    'header.whatsapp': 'Написать в WhatsApp',

    // Hero
    'hero.title': 'Баночный массаж для здоровья, лёгкости и восстановления',
    'hero.title.accent': 'восстановления',
    'hero.subtitle': 'Профессиональный вакуумный массаж на дому или в комфортных условиях кабинета. Выберите удобный для вас вариант.',
    'hero.badge': 'Массаж предоставляется только женщинам и детям.',
    'hero.card1.title': 'Массаж у вас дома',
    'hero.card1.price': '70 сомони',
    'hero.card1.desc': 'Предоплата — 20 сомони на карту. Оставшаяся сумма оплачивается после завершения массажа.',
    'hero.card2.title': 'Массаж у нас',
    'hero.card2.desc': 'Всё необходимое уже есть на месте. Выберите удобный вариант и свяжитесь с нами для уточнения стоимости и записи.',
    'hero.btn.whatsapp': 'Написать в WhatsApp',
    'hero.btn.more': 'Узнать подробнее',
    'hero.btn.address': 'Посмотреть адрес',

    // Benefits
    'benefits.title': 'Польза баночного массажа',
    'benefits.subtitle': 'Как вакуумный массаж помогает вашему телу и самочувствию',
    'benefit.1.title': 'Улучшение кровотока',
    'benefit.1.desc': 'Вакуум усиливает микроциркуляцию крови и лимфы в тканях.',
    'benefit.2.title': 'Тонус и эластичность кожи',
    'benefit.2.desc': 'Процедура способствует повышению эластичности кожи и может помочь уменьшить выраженность целлюлита.',
    'benefit.3.title': 'Снятие напряжения',
    'benefit.3.desc': 'Массаж помогает расслабить зажатые мышцы, особенно в области спины и шейно-воротниковой зоны.',
    'benefit.4.title': 'Стимуляция тканей',
    'benefit.4.desc': 'Способствует улучшению циркуляции крови, лимфы и межклеточной жидкости.',
    'benefit.5.title': 'Поддержка восстановления',
    'benefit.5.desc': 'Может помочь снизить мышечное напряжение и улучшить общее самочувствие.',
    'benefit.6.title': 'Улучшение состояния кожи',
    'benefit.6.desc': 'Стимулирует тонус и процессы обновления тканей.',

    // What is cupping
    'whatis.title': 'Что такое баночный массаж?',
    'whatis.p1': 'Баночный массаж — это разновидность вакуумного массажа. Для процедуры применяются банки из стекла, силикона, резины или современные модели со специальным устройством для создания отрицательного давления.',
    'whatis.p2': 'Традиционно баночный массаж использовался как часть восстановительных процедур. Сегодня его также выбирают для расслабления мышц, улучшения микроциркуляции и ухода за кожей.',

    // Effects
    'effects.title': 'Основные эффекты процедуры',
    'effects.subtitle': 'Что даёт баночный массаж при регулярном применении',
    'effects.1': 'повышение эластичности и тонуса кожи',
    'effects.2': 'стимуляция биоактивных зон тела',
    'effects.3': 'ускорение микроциркуляции в тканях',
    'effects.4': 'поддержка дыхательной функции кожи',
    'effects.5': 'улучшение циркуляции крови, лимфы и межклеточной жидкости',
    'effects.6': 'снижение ощущения напряжения в мышцах',
    'effects.7': 'поддержка общего восстановления организма',

    // Steps
    'steps.title': 'Как проходит массаж',
    'steps.subtitle': 'Четыре этапа процедуры — от подготовки до рекомендаций',
    'step.1.title': 'Подготовка кожи',
    'step.1.desc': 'Перед процедурой используется достаточное количество массажного масла или крема для мягкого и безопасного скольжения.',
    'step.2.title': 'Работа с банками',
    'step.2.desc': 'Специалист аккуратно создаёт вакуум и выполняет массажные движения в нужных зонах.',
    'step.3.title': 'Направление движений',
    'step.3.desc': 'На теле и конечностях массажные движения обычно выполняются снизу вверх, с учётом направления лимфотока.',
    'step.4.title': 'Рекомендации после процедуры',
    'step.4.desc': 'После массажа клиент получает простые рекомендации по восстановлению и уходу.',

    // Contraindications
    'contra.title': 'Противопоказания',
    'contra.subtitle': 'Важно знать перед процедурой',
    'contra.header': 'Перед процедурой обязательно сообщите о состоянии здоровья. Баночный массаж не проводится или требует консультации специалиста при:',
    'contra.1': 'варикозном расширении вен',
    'contra.2': 'повреждениях, раздражениях и воспалениях кожи',
    'contra.3': 'нарушениях свёртываемости крови',
    'contra.4': 'онкологических заболеваниях',
    'contra.5': 'высокой температуре и острых состояниях',
    'contra.6': 'беременности — только после консультации врача',
    'contra.7': 'в зоне лимфатических узлов',
    'contra.warning': 'Информация на сайте носит ознакомительный характер и не заменяет консультацию врача. При хронических заболеваниях предварительно проконсультируйтесь со специалистом.',
    'contra.children': 'Процедуры для детей проводятся только с учётом возраста, состояния здоровья и после предварительного согласования с родителем или законным представителем.',

    // Pricing
    'pricing.title': 'Цены и запись',
    'pricing.subtitle': 'Выберите удобный для вас вариант',
    'pricing.card1.title': 'Выезд к вам домой',
    'pricing.card1.price': '70 сомони',
    'pricing.card1.f1': 'Предоплата: 20 сомони на карту',
    'pricing.card1.f2': 'Остальная сумма — после завершения массажа',
    'pricing.card1.f3': 'Комфортная процедура у вас дома',
    'pricing.card1.btn': 'Заказать выезд',
    'pricing.card2.title': 'Массаж у нас',
    'pricing.card2.price': 'Стоимость уточняется при записи',
    'pricing.card2.f1': 'Всё необходимое есть на месте',
    'pricing.card2.f2': 'Удобная локация',
    'pricing.card2.f3': 'Выберите подходящий для себя вариант',
    'pricing.card2.btn': 'Уточнить цену',
    'pricing.note': 'Услуги доступны только женщинам и детям. Выберите удобный вариант — мы ответим вам в WhatsApp.',
    'pricing.badge.popular': 'Популярный выбор',

    // WhatsApp messages
    'wa.general': 'Здравствуйте! Я хочу узнать подробнее о баночном массаже и записаться на процедуру.',
    'wa.home': 'Меня интересует баночный массаж с выездом на дом.',
    'wa.clinic': 'Меня интересует баночный массаж по вашему адресу.',

    // Contact page
    'contact.title': 'Где мы находимся',
    'contact.subtitle': 'Свяжитесь с нами удобным способом',
    'contact.address.label': 'Адрес',
    'contact.address.value': 'Зарафшон 22/1',
    'contact.whatsapp.label': 'WhatsApp',
    'contact.instagram.label': 'Instagram',
    'contact.hours.label': 'Часы работы',
    'contact.hours.weekdays': 'Пн – Пт: 9:00 – 19:00',
    'contact.hours.saturday': 'Суббота: 10:00 – 16:00',
    'contact.hours.sunday': 'Воскресенье: выходной',
    'contact.btn.whatsapp': 'Написать в WhatsApp',
    'contact.btn.instagram': 'Открыть Instagram',
    'contact.btn.route': 'Построить маршрут',
    'contact.form.title': 'Форма обратной связи',
    'contact.form.subtitle': 'Заполните форму — мы свяжемся с вами в WhatsApp',
    'contact.form.name': 'Имя',
    'contact.form.phone': 'Номер телефона',
    'contact.form.time': 'Удобное время',
    'contact.form.comment': 'Комментарий',
    'contact.form.forWhom': 'Кому нужна процедура?',
    'contact.form.forWhom.woman': 'Женщине',
    'contact.form.forWhom.child': 'Ребёнку',
    'contact.form.childNote': 'Для записи ребёнка необходима предварительная связь с родителем или законным представителем.',
    'contact.form.submit': 'Отправить заявку',
    'contact.form.success': 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
    'contact.form.success.title': 'Заявка отправлена!',

    // Footer
    'footer.about': 'Профессиональный баночный массаж для здоровья, лёгкости и восстановления. Услуги только для женщин и детей.',
    'footer.note': 'Услуги предоставляются только женщинам и детям',
    'footer.links.title': 'Быстрые ссылки',
    'footer.contacts.title': 'Контакты',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.copyright': '© 2026 Баночный массаж. Все права защищены.',

    // 404
    '404.code': '404',
    '404.title': 'Страница не найдена',
    '404.desc': 'К сожалению, такой страницы не существует. Вернитесь на главную или свяжитесь с нами в WhatsApp.',
    '404.btn.home': 'На главную',
    '404.btn.whatsapp': 'Написать в WhatsApp',

    // Mobile bar
    'mobile.home': 'Главная',
    'mobile.services': 'Услуги',
    'mobile.whatsapp': 'Написать',
    'mobile.contacts': 'Контакты',
  },

  tj: {
    // Header
    'nav.home': 'Асосӣ',
    'nav.benefits': 'Бартариҳо',
    'nav.process': 'Массаж чӣ гуна мегузарад',
    'nav.prices': 'Нархҳо',
    'nav.contacts': 'Тамос',
    'header.whatsapp': 'Ба WhatsApp нависед',

    // Hero
    'hero.title': 'Массажи бонкагӣ барои саломатӣ, сабукӣ ва беҳсозӣ',
    'hero.title.accent': 'беҳсозӣ',
    'hero.subtitle': 'Массажи касбии вакуумӣ дар хона ё дар шароити фароҳми фароҳм. Варианти мувофиқро интихоб кунед.',
    'hero.badge': 'Хидмати массаж танҳо барои занон ва кӯдакон пешниҳод мешавад.',
    'hero.card1.title': 'Массаж дар хонаи шумо',
    'hero.card1.price': '70 сомонӣ',
    'hero.card1.desc': 'Пешпардохт — 20 сомонӣ ба корт. Боқимонда маблағ пас аз анҷоми массаж пардохт мешавад.',
    'hero.card2.title': 'Массаж дар назди мо',
    'hero.card2.desc': 'Ҳама чизи лозимӣ дар ҷой ҳаст. Варианти мувофиқро интихоб кунед ва барои роҳандозӣ бо мо дар тамос шавед.',
    'hero.btn.whatsapp': 'Ба WhatsApp нависед',
    'hero.btn.more': 'Маълумоти бештар',
    'hero.btn.address': 'Нишониро бубинед',

    // Benefits
    'benefits.title': 'Фоидаи массажи бонкагӣ',
    'benefits.subtitle': 'Массажи вакуумӣ чӣ гуна ба бадан ва ҳолати шумо кӯмак мекунад',
    'benefit.1.title': 'Беҳтар намудани ҷараёни хун',
    'benefit.1.desc': 'Вакуум микроиртиботи хун ва лимфаро дар бофтаҳо зиёд мекунад.',
    'benefit.2.title': 'Тонус ва чандирии пӯст',
    'benefit.2.desc': 'Таҷриба ба афзоиши чандирии пӯст мусоидат мекунад ва метавонад ба коҳиши зоҳири селюлит кӯмак расонад.',
    'benefit.3.title': 'Оронтанӣ ва сабукӣ',
    'benefit.3.desc': 'Массаж ба ороишани мушакҳои шадид, махсусан дар минтақаи пушт ва гардан кӯмак мекунад.',
    'benefit.4.title': 'Стимулияти бофтаҳо',
    'benefit.4.desc': 'Ба беҳтар намудани ҷараёни хун, лимфа ва моеи байни ҳуҷайраҳо мусоидат мекунад.',
    'benefit.5.title': 'Пуштибонии беҳсозӣ',
    'benefit.5.desc': 'Метавонад ба коҳиши шиддати мушакҳо ва беҳтар намудани ҳолати умумӣ кӯмак расонад.',
    'benefit.6.title': 'Беҳтар намудани ҳолати пӯст',
    'benefit.6.desc': 'Тонус ва равандҳои навсозии бофтаҳоро стимулият мекунад.',

    // What is cupping
    'whatis.title': 'Массажи бонкагӣ чист?',
    'whatis.p1': 'Массажи бонкагӣ — навъи массажи вакуумӣ аст. Барои таҷриба банқҳои аз шиша, силкон, резина ё моделҳои муосир бо дастгоҳи махсус барои эҷоди фишори манфӣ истифода мешаванд.',
    'whatis.p2': 'Таърихан массажи бонкагӣ ҳамчун қисми равандҳои беҳсозӣ истифода мешуд. Имрӯз онро барои ороиши мушакҳо, беҳтар намудани микроиртибот ва нигоҳубини пӯст интихоб мекунанд.',

    // Effects
    'effects.title': 'Таъсирҳои асосии таҷриба',
    'effects.subtitle': 'Массажи бонкагӣ бо истифодаи мунтазам чӣ медиҳад',
    'effects.1': 'афзоиши чандирӣ ва тонуси пӯст',
    'effects.2': 'стимулияти минтақаҳои биоактиви бадан',
    'effects.3': 'суръат бахшидани микроиртибот дар бофтаҳо',
    'effects.4': 'пуштибонии функсияи нафасгирӣи пӯст',
    'effects.5': 'беҳтар намудани ҷараёни хун, лимфа ва моеи байни ҳуҷайраҳо',
    'effects.6': 'коҳиши ҳисси шиддат дар мушакҳо',
    'effects.7': 'пуштибонии беҳсозии умумии организм',

    // Steps
    'steps.title': 'Массаж чӣ гуна мегузарад',
    'steps.subtitle': 'Чор марҳилаи таҷриба — аз омодагӣ то тавсияҳо',
    'step.1.title': 'Омодасозии пӯст',
    'step.1.desc': 'Пеш аз таҷриба миқдори кофии равған ё креми массажӣ барои лағжиши нарм ва бехатар истифода мешавад.',
    'step.2.title': 'Кор бо банқҳо',
    'step.2.desc': 'Мутахассис эҳтиёткорона вакуумро эҷод мекунад ва ҳаракатҳои массажиро дар минтақаҳои лозимӣ иҷро мекунад.',
    'step.3.title': 'Самти ҳаракатҳо',
    'step.3.desc': 'Дар бадан ва узвҳо ҳаракатҳои массажӣ одатан аз поён ба боло, бо назардошти самти ҷараёни лимфа иҷро мешаванд.',
    'step.4.title': 'Тавсияҳо баъди таҷриба',
    'step.4.desc': 'Баъди массаж мизоҷ тавсияҳои оддӣ дар бораи беҳсозӣ ва нигоҳубин мегирад.',

    // Contraindications
    'contra.title': 'Зиддиятҳо',
    'contra.subtitle': 'Пеш аз таҷриба муҳим аст донед',
    'contra.header': 'Пеш аз таҷриба ҳатман дар бораи ҳолати саломатӣ хабар диҳед. Массажи бонкагӣ гузаронида намешавад ё маслиҳати мутахассисро талаб мекунад дар ҳолати:',
    'contra.1': 'варикози рагҳо',
    'contra.2': 'осеб, ангезиш ва илтиҳоби пӯст',
    'contra.3': 'васеъшавии хун',
    'contra.4': 'бемориҳои онкологӣ',
    'contra.5': 'ҳарорати баланд ва ҳолатҳои шадид',
    'contra.6': 'ҳомиладорӣ — танҳо баъди маслиҳати духтур',
    'contra.7': 'дар минтақаи гиреҳҳои лимфавӣ',
    'contra.warning': 'Маълумот дар сайт мазади маълумотӣ дорад ва маслиҳати духтурро иваз намекунад. Дар ҳолати бемориҳои музмин пеш аз таҷриба бо мутахассис маслиҳат кунед.',
    'contra.children': 'Массаж барои кӯдакон танҳо бо назардошти синну сол, ҳолати саломатӣ ва баъди мувофиқа бо падару модар ё намояндаи қонунӣ гузаронида мешавад.',

    // Pricing
    'pricing.title': 'Нархҳо ва қабул',
    'pricing.subtitle': 'Варианти мувофиқро интихоб кунед',
    'pricing.card1.title': 'Омадан ба хонаи шумо',
    'pricing.card1.price': '70 сомонӣ',
    'pricing.card1.f1': 'Пешпардохт: 20 сомонӣ ба корт',
    'pricing.card1.f2': 'Боқимонда маблағ — баъди анҷоми массаж',
    'pricing.card1.f3': 'Таҷрибаи фароҳм дар хонаи шумо',
    'pricing.card1.btn': 'Хонаомадро фармоиш диҳед',
    'pricing.card2.title': 'Массаж дар назди мо',
    'pricing.card2.price': 'Нарх ҳангоми қабул равшан мешавад',
    'pricing.card2.f1': 'Ҳама чизи лозимӣ дар ҷой ҳаст',
    'pricing.card2.f2': 'Локатсияи фароҳм',
    'pricing.card2.f3': 'Варианти мувофиқро интихоб кунед',
    'pricing.card2.btn': 'Нархро равшан кунед',
    'pricing.note': 'Хидматҳо танҳо барои занон ва кӯдакон дастрасанд. Варианти мувофиқро интихоб кунед — мо дар WhatsApp ба шумо ҷавоб медиҳем.',
    'pricing.badge.popular': 'Интихоби маъмул',

    // WhatsApp messages
    'wa.general': 'Салом! Ман мехоҳам дар бораи массажи бонкагӣ маълумоти бештар гирам ва барои қабул нависам.',
    'wa.home': 'Ман массажи бонкагӣ бо омадан ба хонаро мехоҳам.',
    'wa.clinic': 'Ман массажи бонкагӣ дар суроғаи шуморо мехоҳам.',

    // Contact page
    'contact.title': 'Мо куҷо ҳастем',
    'contact.subtitle': 'Бо мо ба тарзи мувофиқ тамос гиред',
    'contact.address.label': 'Суроға',
    'contact.address.value': 'Зарафшон 22/1',
    'contact.whatsapp.label': 'WhatsApp',
    'contact.instagram.label': 'Instagram',
    'contact.hours.label': 'Соатҳои кор',
    'contact.hours.weekdays': 'Душ – Ҷум: 9:00 – 19:00',
    'contact.hours.saturday': 'Шанбе: 10:00 – 16:00',
    'contact.hours.sunday': 'Якшанбе: истироҳат',
    'contact.btn.whatsapp': 'Ба WhatsApp нависед',
    'contact.btn.instagram': 'Instagram-ро кушоед',
    'contact.btn.route': 'Роҳсозӣ кунед',
    'contact.form.title': 'Формаи тамос',
    'contact.form.subtitle': 'Формаро пур кунед — мо дар WhatsApp бо шумо тамос мегирем',
    'contact.form.name': 'Ном',
    'contact.form.phone': 'Рақами телефон',
    'contact.form.time': 'Вақти мувофиқ',
    'contact.form.comment': 'Эзоҳ',
    'contact.form.forWhom': 'Ба кист лозим аст?',
    'contact.form.forWhom.woman': 'Ба зан',
    'contact.form.forWhom.child': 'Ба кӯдак',
    'contact.form.childNote': 'Барои қабули кӯдак пешакӣ тамос бо падару модар ё намояндаи қонунӣ лозим аст.',
    'contact.form.submit': 'Дархостро фиристонед',
    'contact.form.success': 'Ташаккур! Дархости шумо фиристода шуд. Мо дар наздиктарин вақт бо шумо тамос мегирем.',
    'contact.form.success.title': 'Дархост фиристода шуд!',

    // Footer
    'footer.about': 'Массажи бонкагии касбӣ барои саломатӣ, сабукӣ ва беҳсозӣ. Хидматҳо танҳо барои занон ва кӯдакон.',
    'footer.note': 'Хидматҳо танҳо барои занон ва кӯдакон пешниҳод мешавад',
    'footer.links.title': 'Пайвандҳои тез',
    'footer.contacts.title': 'Тамосҳо',
    'footer.privacy': 'Сиёсати махфият',
    'footer.copyright': '© 2026 Массажи бонкагӣ. Ҳама ҳуқуқҳо ҳифз шудаанд.',

    // 404
    '404.code': '404',
    '404.title': 'Саҳифа ёфт нашуд',
    '404.desc': 'Мутаассифона, чунин саҳифа вуҷуд надорад. Ба саҳифаи асосӣ баргардед ё ба мо дар WhatsApp нависед.',
    '404.btn.home': 'Ба асосӣ',
    '404.btn.whatsapp': 'Ба WhatsApp нависед',

    // Mobile bar
    'mobile.home': 'Асосӣ',
    'mobile.services': 'Хидматҳо',
    'mobile.whatsapp': 'Нависед',
    'mobile.contacts': 'Тамос',
  },

  en: {
    // Header
    'nav.home': 'Home',
    'nav.benefits': 'Benefits',
    'nav.process': 'How It Works',
    'nav.prices': 'Prices',
    'nav.contacts': 'Contacts',
    'header.whatsapp': 'Message on WhatsApp',

    // Hero
    'hero.title': 'Cupping massage for health, lightness and recovery',
    'hero.title.accent': 'recovery',
    'hero.subtitle': 'Professional vacuum massage at your home or in a comfortable clinic setting. Choose the option that works for you.',
    'hero.badge': 'Massage services are available for women and children only.',
    'hero.card1.title': 'Massage at your home',
    'hero.card1.price': '70 somoni',
    'hero.card1.desc': 'Prepayment — 20 somoni to the card. The remaining amount is paid after the massage is completed.',
    'hero.card2.title': 'Massage at our place',
    'hero.card2.desc': 'Everything you need is already on site. Choose a convenient option and contact us to clarify the cost and book.',
    'hero.btn.whatsapp': 'Message on WhatsApp',
    'hero.btn.more': 'Learn more',
    'hero.btn.address': 'View address',

    // Benefits
    'benefits.title': 'Benefits of cupping massage',
    'benefits.subtitle': 'How vacuum massage helps your body and well-being',
    'benefit.1.title': 'Improved blood flow',
    'benefit.1.desc': 'Vacuum enhances microcirculation of blood and lymph in tissues.',
    'benefit.2.title': 'Skin tone and elasticity',
    'benefit.2.desc': 'The procedure helps improve skin elasticity and may help reduce the appearance of cellulite.',
    'benefit.3.title': 'Tension relief',
    'benefit.3.desc': 'Massage helps relax tight muscles, especially in the back and neck-shoulder area.',
    'benefit.4.title': 'Tissue stimulation',
    'benefit.4.desc': 'Promotes improved circulation of blood, lymph and intercellular fluid.',
    'benefit.5.title': 'Recovery support',
    'benefit.5.desc': 'May help reduce muscle tension and improve overall well-being.',
    'benefit.6.title': 'Improved skin condition',
    'benefit.6.desc': 'Stimulates tissue tone and renewal processes.',

    // What is cupping
    'whatis.title': 'What is cupping massage?',
    'whatis.p1': 'Cupping massage is a type of vacuum massage. The procedure uses cups made of glass, silicone, rubber or modern models with a special device to create negative pressure.',
    'whatis.p2': 'Traditionally, cupping massage was used as part of restorative procedures. Today it is also chosen for muscle relaxation, improving microcirculation and skin care.',

    // Effects
    'effects.title': 'Main effects of the procedure',
    'effects.subtitle': 'What cupping massage provides with regular use',
    'effects.1': 'increased skin elasticity and tone',
    'effects.2': 'stimulation of bioactive zones of the body',
    'effects.3': 'accelerated microcirculation in tissues',
    'effects.4': 'support of skin respiratory function',
    'effects.5': 'improved circulation of blood, lymph and intercellular fluid',
    'effects.6': 'reduced feeling of muscle tension',
    'effects.7': 'support of overall body recovery',

    // Steps
    'steps.title': 'How the massage works',
    'steps.subtitle': 'Four stages of the procedure — from preparation to recommendations',
    'step.1.title': 'Skin preparation',
    'step.1.desc': 'Before the procedure, a sufficient amount of massage oil or cream is used for smooth and safe gliding.',
    'step.2.title': 'Working with cups',
    'step.2.desc': 'The specialist carefully creates a vacuum and performs massage movements in the required areas.',
    'step.3.title': 'Direction of movements',
    'step.3.desc': 'On the body and limbs, massage movements are usually performed upward, following the lymph flow direction.',
    'step.4.title': 'Post-procedure recommendations',
    'step.4.desc': 'After the massage, the client receives simple recommendations for recovery and care.',

    // Contraindications
    'contra.title': 'Contraindications',
    'contra.subtitle': 'Important to know before the procedure',
    'contra.header': 'Be sure to inform about your health condition before the procedure. Cupping massage is not performed or requires specialist consultation in case of:',
    'contra.1': 'varicose veins',
    'contra.2': 'skin damage, irritation and inflammation',
    'contra.3': 'blood clotting disorders',
    'contra.4': 'oncological diseases',
    'contra.5': 'high fever and acute conditions',
    'contra.6': 'pregnancy — only after doctor consultation',
    'contra.7': 'in the area of lymph nodes',
    'contra.warning': 'The information on the website is for informational purposes only and does not replace a doctor consultation. For chronic conditions, consult a specialist beforehand.',
    'contra.children': 'Massage sessions for children are provided only after prior agreement with a parent or legal guardian, taking into account the child\'s age and health condition.',

    // Pricing
    'pricing.title': 'Prices and booking',
    'pricing.subtitle': 'Choose the option that works for you',
    'pricing.card1.title': 'Home visit',
    'pricing.card1.price': '70 somoni',
    'pricing.card1.f1': 'Prepayment: 20 somoni to the card',
    'pricing.card1.f2': 'Remaining amount — after the massage',
    'pricing.card1.f3': 'Comfortable procedure at your home',
    'pricing.card1.btn': 'Book a home visit',
    'pricing.card2.title': 'Massage at our place',
    'pricing.card2.price': 'Price clarified at booking',
    'pricing.card2.f1': 'Everything you need is on site',
    'pricing.card2.f2': 'Convenient location',
    'pricing.card2.f3': 'Choose the right option for you',
    'pricing.card2.btn': 'Clarify the price',
    'pricing.note': 'Services are available for women and children only. Choose a convenient option — we will reply to you on WhatsApp.',
    'pricing.badge.popular': 'Popular choice',

    // WhatsApp messages
    'wa.general': 'Hello! I would like to know more about cupping massage and book an appointment.',
    'wa.home': 'I am interested in cupping massage with a home visit.',
    'wa.clinic': 'I am interested in cupping massage at your location.',

    // Contact page
    'contact.title': 'Where to find us',
    'contact.subtitle': 'Contact us in a way that is convenient for you',
    'contact.address.label': 'Address',
    'contact.address.value': 'Zarafshon 22/1',
    'contact.whatsapp.label': 'WhatsApp',
    'contact.instagram.label': 'Instagram',
    'contact.hours.label': 'Working hours',
    'contact.hours.weekdays': 'Mon – Fri: 9:00 – 19:00',
    'contact.hours.saturday': 'Saturday: 10:00 – 16:00',
    'contact.hours.sunday': 'Sunday: closed',
    'contact.btn.whatsapp': 'Message on WhatsApp',
    'contact.btn.instagram': 'Open Instagram',
    'contact.btn.route': 'Get directions',
    'contact.form.title': 'Contact form',
    'contact.form.subtitle': 'Fill out the form — we will contact you on WhatsApp',
    'contact.form.name': 'Name',
    'contact.form.phone': 'Phone number',
    'contact.form.time': 'Preferred time',
    'contact.form.comment': 'Comment',
    'contact.form.forWhom': 'Who needs the procedure?',
    'contact.form.forWhom.woman': 'For a woman',
    'contact.form.forWhom.child': 'For a child',
    'contact.form.childNote': 'Booking a child requires prior contact with a parent or legal guardian.',
    'contact.form.submit': 'Submit request',
    'contact.form.success': 'Thank you! Your request has been sent. We will contact you shortly.',
    'contact.form.success.title': 'Request sent!',

    // Footer
    'footer.about': 'Professional cupping massage for health, lightness and recovery. Services for women and children only.',
    'footer.note': 'Services are provided for women and children only',
    'footer.links.title': 'Quick links',
    'footer.contacts.title': 'Contacts',
    'footer.privacy': 'Privacy policy',
    'footer.copyright': '© 2026 Cupping Massage. All rights reserved.',

    // 404
    '404.code': '404',
    '404.title': 'Page not found',
    '404.desc': 'Unfortunately, this page does not exist. Return to the home page or message us on WhatsApp.',
    '404.btn.home': 'To home page',
    '404.btn.whatsapp': 'Message on WhatsApp',

    // Mobile bar
    'mobile.home': 'Home',
    'mobile.services': 'Services',
    'mobile.whatsapp': 'Message',
    'mobile.contacts': 'Contacts',
  }
};

// Current language
let currentLang = localStorage.getItem('lang') || 'ru';

// Apply translations
function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'tj' ? 'tg' : lang;

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update hero title with accent
  const heroTitle = document.querySelector('[data-i18n-hero]');
  if (heroTitle && translations[lang]['hero.title']) {
    const fullTitle = translations[lang]['hero.title'];
    const accentWord = translations[lang]['hero.title.accent'];
    if (fullTitle.includes(accentWord)) {
      heroTitle.innerHTML = fullTitle.replace(accentWord, `<span class="accent">${accentWord}</span>`);
    } else {
      heroTitle.textContent = fullTitle;
    }
  }

  // Update WhatsApp links with localized messages
  document.querySelectorAll('[data-wa]').forEach(el => {
    const type = el.getAttribute('data-wa');
    let msg = translations[lang]['wa.general'];
    if (type === 'home') msg = translations[lang]['wa.general'] + ' ' + translations[lang]['wa.home'];
    if (type === 'clinic') msg = translations[lang]['wa.general'] + ' ' + translations[lang]['wa.clinic'];
    const encodedMsg = encodeURIComponent(msg);
    el.href = `https://wa.me/992007336264?text=${encodedMsg}`;
  });

  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update select options for form
  const forWhomSelect = document.getElementById('forWhom');
  if (forWhomSelect) {
    const currentValue = forWhomSelect.value;
    forWhomSelect.innerHTML = `<option value="">${translations[lang]['contact.form.forWhom']}</option>`;
    forWhomSelect.innerHTML += `<option value="woman">${translations[lang]['contact.form.forWhom.woman']}</option>`;
    forWhomSelect.innerHTML += `<option value="child">${translations[lang]['contact.form.forWhom.child']}</option>`;
    if (currentValue) forWhomSelect.value = currentValue;
  }
}

// Get current language
function getLang() { return currentLang; }
