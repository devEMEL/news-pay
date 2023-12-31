import portalImg from "../images/portal.png";

const navigation = [
  {
    name: "portal",
    href: "https://portal.dymension.xyz/ibc",
    icon: portalImg,
  },
];

export default function Footer() {
  return (
    <footer className="bg-gypsum mt-auto border-black border-t">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-black hover:text-forest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              {/* <item.icon className="h-6 w-6" aria-hidden="true" /> */}
              <img
                src={item.icon}
                alt="portalImg"
                className="h-10 w-10"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
