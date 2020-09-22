// CDN URLs
const JQUERY_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
const FONT_AWESOME_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/js/all.min.js';
const ANALYTICS_ID = 'UA-145902983-1';
const GTAG_CDN = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;

// Metadata
const CHARSET = 'utf-8';
const AUTHOR = 'Travis Martin';
const VIEWPORT = 'width=device-width, initial-scale=1.0';
const FAVICON_URL = '/favicon.ico';

// Topnav
const TOPNAV_ID = 'topnav';
const TOPNAV_SCRIPT = '/s/js/topnav.js';
const NAVBAR_STYLESHEET = '/s/css/navbar.css';

// Botnav
const BOTNAV_ID = 'botnav';
const THEME_DROPDOWN_ID = 'theme-dropdown';
const BOTNAV_SCRIPT = '/s/js/botnav.js';

// Sidenav
const SIDENAV_ID = 'sidenav';
const SIDENAV_STYLESHEET = '/s/css/sidenav.css';

// Dropdown
const DROPDOWN_CLASS = 'dropdown';
const DROPDOWN_BUTTON_CLASS = 'dropdown-button';
const DROPDOWN_CONTENT_CLASS = 'dropdown-content';
const DROPDOWN_SCRIPT = '/s/js/dropdown.js';
const DROPDOWN_STYLESHEET = '/s/css/dropdown.css';

// Slideshow
const SLIDESHOW_CLASS = 'slideshow';
const SLIDESHOW_CONTENT_CLASS = 'slideshow-content';
const SLIDESHOW_CONTROLLER_CLASS = 'slideshow-controller';
const SLIDE_CLASS = 'slide';
const SLIDESHOW_CONTROLLER_DOT_CLASS = 'dot';
const SLIDESHOW_SCRIPT = '/s/js/slideshow.js';
const SLIDESHOW_STYLESHEET = '/s/css/slideshow.css';

// Tabs
const TAB_CLASS = 'tab';
const ALL_TAB_CONTENT_CLASS = 'tab-content';
const ALL_TAB_BUTTON_CLASS = 'tab-controller';
const TAB_CONTENT_CLASS = 'tab-panel';
const TAB_BUTTON_CLASS = 'tab-button';
const TAB_SCRIPT = '/s/js/tab.js';
const TAB_STYLESHEET = '/s/css/tab.css';

// Filter
const FILTER_CLASS = 'filter';
const FILTER_CONTENT_CLASS = 'filter-content';
const FILTER_CONTROLLER_CLASS = 'filter-controller';
const FILTER_ITEM_CLASS = 'filter-item';
const FILTER_CONTROLLER_BUTTON_CLASS = 'filter-button'
const FILTER_SCRIPT = '/s/js/filter.js';
const FILTER_STYLESHEET = '/s/css/filter.css';

// Miscellaneous
const ACTIVE_CLASS = 'active';
const STANDARD_STYLESHEET = '/s/css/standard.css';

// Credit: Simon Willison.
const addLoadEvent = (event) => {
	const old = window.onload;
	if (typeof old != 'function') {
		window.onload = event;
	} else {
		window.onload = () => {
			old();
			event();
		}
	}
}

// Load a JavaScript file.
const loadScript = (src, onload) => {
	if (!document.querySelector(`script[src='${src}']`)) {
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		if (onload) { script.onload = onload; }
		document.head.append(script);
	}
}

// Load a CSS file.
const loadStyle = (href, onload) => {
	if (!document.querySelector(`link[rel='stylesheet'][href='${href}']`)) {
		const stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.href = href;
		if (onload) { stylesheet.onload = onload; }
		document.head.append(stylesheet);
	}
}

// Check that page content is split into header, main, and footer for flexbox.
addLoadEvent(() => {
	if (!document.querySelector('main')) {
		console.log('Automatically moving all content into main.');
		const main = document.createElement('main');
		document.body.append(main);

		// Move all elements into main.
		const nodes = [];
		for (let i = 0; i < document.body.childNodes.length; i++) {
			const node = document.body.childNodes[i];
			if (node == main) { continue; }
			nodes.push(node);
		}

		nodes.forEach((node) => main.append(node));
	}

	if (!document.querySelector('header')) {
		console.log('Automatically creating header.');
		document.body.prepend(document.createElement('header'));
	}

	if (!document.querySelector('footer')) {
		console.log('Automatically creating footer.');
		document.body.append(document.createElement('footer'));
	}
});

// Check that image elements have alt attributes.
addLoadEvent(() => {
	const images = document.querySelectorAll('img');
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		if (!image.alt) {
			console.warn('No alt attribute set for image. Using placeholder.');
			image.alt = image.src.split('/').pop().split('.').shift().toUpperCase();
		}
	}
});

// Load dropdown assets if any are present. Also called after loading navbars, in case any are included within.
const loadDropdown = () => {
	if (document.querySelector(`div[class*='${DROPDOWN_CLASS}']`)) {
		loadScript(DROPDOWN_SCRIPT, () => console.log('Loaded dropdown script.'));
		loadStyle(DROPDOWN_STYLESHEET, () => console.warn('The dropdown stylesheet should be included in the head to avoid flashing.'));
	}
}
addLoadEvent(() => loadDropdown());

// Load slideshow assets if any are present.
addLoadEvent(() => {
	if (document.querySelector(`div[class*='${SLIDESHOW_CLASS}']`)) {
		loadScript(SLIDESHOW_SCRIPT, () => console.log('Loaded slideshow script.'));
		loadStyle(SLIDESHOW_STYLESHEET, () => console.warn('The slideshow stylesheet should be included in the head to avoid flashing.'));
	}
});

// Load tab assets if any are present.
addLoadEvent(() => {
	if (document.querySelector(`div[class*='${TAB_CLASS}'`)) {
		loadScript(TAB_SCRIPT, () => console.log('Loaded tab script.'));
		loadStyle(TAB_STYLESHEET, () => console.warn('The tab stylesheet should be included in the head to avoid flashing.'));
	}
});

// Load filter assets if any are present.
addLoadEvent(() => {
	if (document.querySelector(`div[class*='${FILTER_CLASS}'`)) {
		loadScript(FILTER_SCRIPT, () => console.log('Loaded filter script.'));
		loadStyle(FILTER_STYLESHEET, () => console.warn('The filter stylesheet should be included in the head to avoid flashing.'));
	}
});

// Load sidenav if present.
addLoadEvent(() => {
	const sidenav = document.querySelector(`div#${SIDENAV_ID}`);
	if (sidenav) { loadStyle(SIDENAV_STYLESHEET, () => console.warn('The sidenav stylesheet should be included in the head to avoid flashing.')); }
});

// Load jQuery, then load navbars if present.
addLoadEvent(() => loadScript(JQUERY_CDN, () => {
	// Load topnav.
	const topnav = document.querySelector(`div#${TOPNAV_ID}`);
	if (topnav) {
		$('#topnav').load('/s/html/topnav.html', () => {
			console.log('Loaded topnav.');
			loadDropdown(); // In case there are dropdowns in the topnav but not the page body.

			const header = document.querySelector('header');
			if (header && !header.contains(topnav)) {
				console.log('Moving topnav into header.');
				header.append(topnav);
			}

			loadScript(TOPNAV_SCRIPT, () => console.log('Loaded topnav script.'));
			loadStyle(NAVBAR_STYLESHEET, () => console.warn('The navbar stylesheet should be included in the head to avoid flashing.'));
		});
	}

	// Load botnav.
	const botnav = document.querySelector(`div#${BOTNAV_ID}`);
	if (botnav) {
		$('#botnav').load('/s/html/botnav.html', () => {
			console.log('Loaded botnav.');
			loadDropdown(); // In case there are dropdowns in the botnav but not the page body.

			const footer = document.querySelector('footer');
			if (footer && !footer.contains(botnav)) {
				console.log('Moving botnav into footer.');
				footer.append(botnav);
			}

			loadScript(BOTNAV_SCRIPT, () => console.log('Loaded botnav script.'));
			loadStyle(NAVBAR_STYLESHEET, () => console.warn('The navbar stylesheet should be included in the head to avoid flashing.'));
		});
	}
}));

// Load Font Awesome.
addLoadEvent(() => loadScript(FONT_AWESOME_CDN, () => console.log('Loaded Font Awesome.')));

// Load Google Analytics.
addLoadEvent(() => loadScript(GTAG_CDN, () => {
	dataLayer = dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());
	gtag('config', ANALYTICS_ID);

	console.log('Setup Google Analytics.');
}));

// Load placeholder/standard metadata if it doesn't already exist.
addLoadEvent(() => {
	const pageName = () => location.pathname.split('/').pop().split('.').shift().toUpperCase();

	// Title.
	if (!document.querySelector('title')) {
		console.warn('No title is set. Using placeholder.');
		const title = document.createElement('title');
		title.innerHTML = 'Lakuna - ' + pageName();
		document.head.append(title);
	}

	// Description.
	if (!document.querySelector('meta[name="description"]')) {
		console.warn('No description is set. Using placeholder.');
		const description = document.createElement('meta');
		description.name = 'description';
		description.content = 'Lakuna - ' + pageName();
		document.head.append(description)
	}

	// Character set.
	if (!document.querySelector('meta[charset]')) {
		console.warn('The character set should be set in the head as a best practice.');
		const charset = document.createElement('meta');
		charset.charset = CHARSET;
		document.head.append(charset);
	}

	// Author.
	if (!document.querySelector('meta[name="author"]')) {
		console.log('Setting default author.');
		const author = document.createElement('meta');
		author.name = 'author';
		author.content = AUTHOR;
		document.head.append(author);
	}

	// Viewport.
	if (!document.querySelector('meta[name="viewport"]')) {
		console.log('Setting default viewport.');
		const viewport = document.createElement('meta');
		viewport.name = 'viewport';
		viewport.content = VIEWPORT;
		document.head.append(viewport);
	}

	// Favicon.
	if (!document.querySelector('link[rel="icon"]')) {
		console.log('Setting default favicon.');
		const icon = document.createElement('link');
		icon.rel = 'icon';
		icon.href = FAVICON_URL;
		document.head.append(icon);
	}

	// Standard stylesheet.
	loadStyle(STANDARD_STYLESHEET, () => console.warn('The standard stylesheet should be included in the head to avoid flashing.'));
});