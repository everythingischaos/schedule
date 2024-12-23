import { Clock3Icon, Palette, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [theme, setTheme] = useState("");
  const [accent, setAccent] = useState("mauve")

  return (
    <main className={`flex min-h-screen w-full flex-col bg-base ${theme}`}>
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-base px-4">
          <Clock3Icon className="text-text" />
          <Button className="ml-auto" size="icon" variant="ghost">
            <Palette />
          </Button>
          <Button size="icon" variant="ghost">
            <Sun />
          </Button>
        </header>
      </div>
    </main>
  );
}

export default App;
