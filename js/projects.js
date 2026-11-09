/* =========================================================
   NEXAWEB: YOUR CONTENT LIVES HERE
   ---------------------------------------------------------
   To add a project: copy one object in the `projects` array, give it a new unique
   `id`, set its fields, and drop a screenshot into assets/images/projects/.
   The site builds every card, category, filter, counter and detail view from this file.
   You never need to touch index.html.

   PROJECT FIELDS
     id           unique number (used in links like index.html#project-3)
     name         project title
     category     one of siteConfig.categories (a new category is created automatically if you invent one)
     description  one or two sentences shown on the card
     details      (optional) longer text for the detail view
     features     (optional) array of short bullet points for the detail view
     thumbnail    path to the main screenshot, ideally 16:10 (for example 1440x900)
     gallery      (optional) more screenshots for the detail view
     technologies array of tags, e.g. ["HTML", "CSS", "JavaScript"]
     liveUrl      your deployed site (https://...). Leave "" if there is no live site yet.
     githubUrl    your repository (https://github.com/...). Leave "" and no GitHub button is shown.
     featured     true to show it in the large "Featured" section (2 or 3 works best)
     year         (optional) 2025
     sample       true marks demo content (shows a "Sample" badge). Delete it for real projects.

   LINKS: URLs that look like placeholders ("your-...", "example", "username") are labelled as such on the site.
   Nothing here is a verified deployment until you replace it with your own URL.
   ========================================================= */

const siteConfig = {
  brand: 'NexaWeb',
  owner: 'NexaWeb',                                   // REPLACE: your name or studio name
  role: 'Web developer and designer',
  status: { available: true, text: 'Open to new projects' },   // set available:false to show "Currently booked"

  /* Links. The GitHub address was taken from your local git remotes (github.com/NexaWeb-dev). Check it.
     LinkedIn and email are placeholders: replace them before publishing. */
  github: 'https://github.com/NexaWeb-dev',
  linkedin: 'https://www.linkedin.com/in/your-profile',    // PLACEHOLDER
  email: 'hello@your-domain.example',                       // PLACEHOLDER

  profileImage: '',            // e.g. 'assets/images/profile/me.jpg'. Leave empty to show a monogram.

  /* Contact form. 'demo' validates and confirms only. 'netlify' posts to Netlify Forms (works once deployed on Netlify).
     'endpoint' posts JSON to a form service URL such as Formspree. */
  contactForm: { mode: 'demo', endpoint: '' },

  /* Order of the category chips. Categories used by a project but not listed here are appended automatically. */
  categories: ['Web Applications', 'Websites', 'UI/UX Design', 'Cloud & DevOps', 'Mobile Applications', 'Experiments'],
  categoryInfo: {
    'Web Applications': 'Interactive products with data, search and logic.',
    'Websites': 'Polished, fast sites for businesses and brands.',
    'UI/UX Design': 'Interface systems, flows and visual design work.',
    'Cloud & DevOps': 'Pipelines, infrastructure and deployment tooling.',
    'Mobile Applications': 'Apps designed for the phone first.',
    'Experiments': 'Small builds, ideas and learning projects.'
  },

  about: {
    heading: 'I build things for the web, and the pipeline behind them.',
    paragraphs: [
      'NexaWeb is my central place for everything I have shipped: websites for businesses, web applications, experiments and infrastructure work. Each project is deployed on its own, and this site links them all together.',
      'I like clean interfaces, careful details and code that is easy to maintain. I also enjoy the engineering that keeps projects running: containers, cloud infrastructure and automated delivery.'
    ],
    interests: ['Front-end development', 'UI and UX design', 'Cloud and DevOps', 'Automation']
  },

  /* Technology section, grouped. Counts ("used in N projects") are calculated from the projects below. */
  techStack: [
    { group: 'Front end', items: ['HTML5', 'CSS3', 'JavaScript', 'React'] },
    { group: 'Back end', items: ['Node.js', 'Express', 'PostgreSQL'] },
    { group: 'Cloud and DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'] },
    { group: 'Tools', items: ['Linux', 'Git & GitHub'] }
  ],
  /* Lets project tags such as "HTML" count towards the stack badge "HTML5". */
  techAliases: { 'HTML': 'HTML5', 'CSS': 'CSS3', 'JS': 'JavaScript', 'Node': 'Node.js', 'Git': 'Git & GitHub', 'GitHub': 'Git & GitHub', 'Postgres': 'PostgreSQL' }
};

const P = 'assets/images/projects/';

const projects = [
  /* ---------- Real work (screenshots captured from the actual sites) ---------- */
  {
    id: 1,
    name: 'Aurelia Café & Restaurant',
    category: 'Websites',
    description: 'A cinematic, editorial restaurant website with a signature-dishes showcase, filterable gallery and table reservation form.',
    details: 'A premium website concept for a boutique café and restaurant. It pairs large photography and editorial typography with a calm, dark-and-cream palette, and every section is built from plain HTML, CSS and JavaScript.',
    features: ['Cinematic hero with parallax and staggered headline animation', 'Signature dishes in an asymmetric editorial layout', 'Menu with category filtering and a masonry gallery with lightbox', 'Validated reservation form and live opening hours', 'Fully responsive, with reduced-motion support'],
    thumbnail: P + 'aurelia-cafe-1.jpg',
    gallery: [P + 'aurelia-cafe-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://restaurant-aurelia.netlify.app/',
    githubUrl: '',
    featured: true,
    year: 2026
  },
  {
    id: 2,
    name: 'Meridian Coffee Atlas',
    category: 'Web Applications',
    description: 'A coffee shop discovery platform with location search, nearest-café sorting and an interactive map.',
    details: 'A café locator in the spirit of a professional store finder. Visitors search by city, area or name, filter with dependent dropdowns, and switch between a list and an interactive map. It runs on a local sample dataset, so no real listings are claimed.',
    features: ['Search plus dependent State, City and Area filters', 'Browser geolocation with Haversine distance sorting', 'Interactive Leaflet and OpenStreetMap map with custom markers', 'List and map views kept in sync, with pagination', 'Café detail pages with hours, map and nearby cafés'],
    thumbnail: P + 'meridian-coffee-atlas-1.jpg',
    gallery: [P + 'meridian-coffee-atlas-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Leaflet'],
    liveUrl: 'https://restaurant-meridian.netlify.app/',
    githubUrl: '',
    featured: true,
    year: 2026
  },
  {
    id: 3,
    name: 'The Salt Cafe',
    category: 'Websites',
    description: 'A rooftop restaurant and café website with menu tabs, gallery lightbox and WhatsApp table requests.',
    details: 'A restaurant website for a rooftop café, redesigned in the Aurelia design language. Business details live in one CONFIG object, so the same codebase can be reused for other venues.',
    features: ['Menu tabs with vegetarian and non-vegetarian markers', 'Gallery with accessible lightbox', 'Reservation form that hands the request to WhatsApp', 'Light and dark themes, structured data for search engines'],
    thumbnail: P + 'salt-cafe-1.jpg',
    gallery: [P + 'salt-cafe-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://restaurant-the-salt-cafe.netlify.app/',
    githubUrl: '',
    featured: false,
    year: 2026
  },
  {
    id: 4,
    name: 'SmileCare Dental Clinic',
    category: 'Websites',
    description: 'A clear, reassuring dental clinic website with services, doctors, fees and appointment booking.',
    details: 'A local-business website for a dental clinic. It focuses on trust and clarity: what the clinic treats, who the doctors are, what it costs and how to book.',
    features: ['Services, doctors and fee sections', 'Appointment request form', 'Reviews and FAQ', 'Tap-to-call and WhatsApp contact options'],
    thumbnail: P + 'smilecare-dental-1.jpg',
    gallery: [P + 'smilecare-dental-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://your-smilecare-clinic.netlify.app',      // PLACEHOLDER
    githubUrl: '',
    featured: false,
    year: 2026
  },
  {
    id: 5,
    name: 'Tadka Box Cloud Kitchen',
    category: 'Websites',
    description: 'A delivery-only cloud kitchen site where customers browse the menu and order direct on WhatsApp.',
    details: 'A direct-ordering website for a cloud kitchen, designed to skip delivery-app fees. Customers build an order from the menu and send it straight to the kitchen on WhatsApp.',
    features: ['Filterable menu and combo offers', 'Direct WhatsApp ordering', 'Delivery areas and how-it-works guide', 'Reviews and FAQ sections'],
    thumbnail: P + 'tadka-box-1.jpg',
    gallery: [P + 'tadka-box-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://your-tadka-box.netlify.app',             // PLACEHOLDER
    githubUrl: '',
    featured: false,
    year: 2026
  },
  {
    id: 6,
    name: 'IronPulse Fitness',
    category: 'Websites',
    description: 'A bold gym website with training programs, membership plans, a BMI calculator and free-trial booking.',
    details: 'A high-energy website for a gym, built around getting a visitor from curiosity to a free trial class as quickly as possible.',
    features: ['Programs, plans and trainers', 'Plan switcher and built-in BMI calculator', 'Weekly class schedule with tabs', 'Free-trial form that opens WhatsApp', 'Live open and closed badge'],
    thumbnail: P + 'ironpulse-fitness-1.jpg',
    gallery: [P + 'ironpulse-fitness-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://gym-ironpulsee.netlify.app/',
    githubUrl: '',
    featured: true,
    year: 2026
  },
  {
    id: 7,
    name: 'Urbannest Realty',
    category: 'Websites',
    description: 'A real estate website with property listings, a home-loan EMI calculator and site-visit booking.',
    details: 'A property website for a local realty business. Visitors filter listings, work out a home-loan EMI and book a site visit without leaving the page.',
    features: ['Searchable property listings', 'EMI calculator', 'Locality guides', 'Site-visit booking form'],
    thumbnail: P + 'urbannest-realty-1.jpg',
    gallery: [P + 'urbannest-realty-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://your-urbannest-realty.netlify.app',      // PLACEHOLDER
    githubUrl: '',
    featured: false,
    year: 2026
  },
  {
    id: 17,
    name: 'NOIR Fine Dining',
    category: 'Websites',
    description: 'A dark, cinematic luxury restaurant website with a signature-dishes showcase, filterable menu, gallery lightbox and table reservations.',
    details: 'A premium website concept for a modern luxury restaurant in Bengaluru. It pairs a full-bleed dining-room hero and elegant serif typography with a charcoal-and-gold palette, and every section is built from plain HTML, CSS and JavaScript.',
    features: ['Full-bleed cinematic hero with animated headline', 'Signature dishes in an editorial layout with scroll reveals', 'Menu with category filtering and a gallery with lightbox', 'Validated reservation form', 'Fully responsive, with reduced-motion support'],
    thumbnail: P + 'noir-restaurant-1.jpg',
    gallery: [P + 'noir-restaurant-2.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://restaurant-noirr.netlify.app/',
    githubUrl: '',
    featured: false,
    year: 2026
  },

  /* ---------- Sample entries: replace or delete (they show a "Sample" badge) ---------- */
  {
    id: 8, sample: true,
    name: 'Music Streaming App',
    category: 'Web Applications',
    description: 'A modern music streaming platform with playlists, search and a persistent player.',
    details: 'Sample entry. Replace with your real project to show a full description here.',
    features: ['Playlists and library', 'Search', 'Persistent mini-player'],
    thumbnail: P + 'music-streaming.jpg',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://your-music-project.netlify.app',
    githubUrl: '',
    featured: false, year: 2025
  },
  {
    id: 9, sample: true,
    name: 'Movie Library',
    category: 'Web Applications',
    description: 'Browse, search and save films with ratings and watchlists.',
    thumbnail: P + 'movie-library.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript', 'REST API'],
    liveUrl: 'https://your-movie-library.netlify.app',
    githubUrl: '',
    featured: false, year: 2025
  },
  {
    id: 10, sample: true,
    name: 'Learning Management Platform',
    category: 'Web Applications',
    description: 'Courses, lessons and progress tracking for students and instructors.',
    thumbnail: P + 'lms-platform.jpg',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    liveUrl: 'https://your-lms-platform.netlify.app',
    githubUrl: '',
    featured: false, year: 2025
  },
  {
    id: 11, sample: true,
    name: 'Card Scanning Application',
    category: 'Mobile Applications',
    description: 'Scan business cards with the phone camera and save the contacts.',
    thumbnail: P + 'card-scanner.jpg',
    technologies: ['JavaScript', 'OCR', 'PWA'],
    liveUrl: 'https://your-card-scanner.netlify.app',
    githubUrl: '',
    featured: false, year: 2025
  },
  {
    id: 12, sample: true,
    name: 'Weather Application',
    category: 'Experiments',
    description: 'Current conditions and a five-day forecast for any city.',
    thumbnail: P + 'weather-app.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
    liveUrl: 'https://your-weather-app.netlify.app',
    githubUrl: '',
    featured: false, year: 2024
  },
  {
    id: 13, sample: true,
    name: 'E-commerce Website',
    category: 'Websites',
    description: 'A storefront with product filtering, a cart and a checkout flow.',
    thumbnail: P + 'ecommerce-store.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://your-ecommerce-store.netlify.app',
    githubUrl: '',
    featured: false, year: 2024
  },
  {
    id: 14, sample: true,
    name: 'Developer Tools',
    category: 'Experiments',
    description: 'A small collection of handy utilities: formatters, converters and generators.',
    thumbnail: P + 'developer-tools.jpg',
    technologies: ['JavaScript', 'Node.js'],
    liveUrl: 'https://your-developer-tools.netlify.app',
    githubUrl: '',
    featured: false, year: 2024
  },
  {
    id: 15, sample: true,
    name: 'CI/CD Pipeline Dashboard',
    category: 'Cloud & DevOps',
    description: 'A dashboard for build status, deployments and infrastructure health.',
    thumbnail: P + 'cicd-dashboard.jpg',
    technologies: ['Jenkins', 'Docker', 'Terraform', 'AWS'],
    liveUrl: '',
    githubUrl: '',
    featured: false, year: 2025
  },
  {
    id: 16, sample: true,
    name: 'Design System',
    category: 'UI/UX Design',
    description: 'A component library with tokens, patterns and usage guidelines.',
    thumbnail: P + 'design-system.jpg',
    technologies: ['CSS', 'JavaScript', 'Figma'],
    liveUrl: 'https://your-design-system.netlify.app',
    githubUrl: '',
    featured: false, year: 2024
  }
];
