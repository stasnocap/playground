export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Next.js + NextUI",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
    {
      label: "Todos",
      href: "/todos",
    },
	],
	navMenuItems: [
		{
			label: "Todos",
			href: "/todos",
		},
	],
	links: {
		github: "https://github.com/stasnocap/playground",
	},
};
