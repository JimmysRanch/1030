import "@/app/globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "1030",
  description: "Dog grooming management"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Nav />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
