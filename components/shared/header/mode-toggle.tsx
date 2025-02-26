'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, SunMoon } from "lucide-react";

const ModeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (<DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant={'ghost'}>

            </Button>
        </DropdownMenuTrigger>

    </DropdownMenu>);
}

export default ModeToggle;