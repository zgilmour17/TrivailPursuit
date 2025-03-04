import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
} from "./drawer";
import { Button } from "./button";
import { BookOpen } from "lucide-react";
import DrinkingRules from "./drinking-rules";

const RulesDrawer = () => {
    return (
        <Drawer>
            {/* Button at the bottom */}
            <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
                <DrawerTrigger asChild>
                    <Button
                        className="flex items-center justify-center space-x-2 rounded-full"
                        variant="secondary"
                    >
                        <span>Rules</span>
                        <BookOpen />
                    </Button>
                </DrawerTrigger>
            </div>

            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center font-bold text-3xl text-white">
                            Rules
                        </DrawerTitle>
                    </DrawerHeader>

                    <DrinkingRules />

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button>Got It</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default RulesDrawer;
