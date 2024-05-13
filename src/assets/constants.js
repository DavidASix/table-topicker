const c = module.exports;

c.siteName = "TableTopicker.com"
c.titlePrefix = 'Table Topicker';
c.url = "tabletopicker.com";

c.plausible_domain = process.env.NODE_ENV === "production"
? "tabletopicker.com"
: "na";

c.google_tag = process.env.NODE_ENV === "production"
? "G-"
: "na";

c.api = 'https://api.tabletopicker.com'

c.sectionPadding = "w-full px-0 md:px-4 lg:px-10 xl:px-48 2xl:px-80 flex flex-col items-center";
c.contentContainer = "max-w-[950px] px-2 md:px-4";