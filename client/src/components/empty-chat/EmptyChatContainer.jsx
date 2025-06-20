import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

function EmptyChatContainer() {
  return (
    <Card className="hidden sm:sticky sm:top-10 flex-1 flex-col dark:bg-background  max-w-[22rem] gap-6 sm:h-[90vh]  md:flex items-center justify-between  rounded-l-none px-6 ">

    

      <CardHeader className="flex flex-col justify-center items-center gap-3 mt-4 ">
        <img src="/react.svg" alt="" className="w-20 animate-spin cursor-grab hover:animate-none transition ease-linear " />
        <h1 className="font-semibold text-lg">Direct Message</h1>
      </CardHeader>


      <h1 className="text-left font-semibold text-3xl">
        Connect<br /><span className="text-bold text-primary">Instantly</span>,<br />Chat<br /><span className="text-bold text-primary">Seamlessly</span>!
      </h1>



      <CardFooter>Project By
        <a href='https://github.com/Mitul30M' className="ml-1 hover:border-b-2 border-primary hover:font-medium">Mitul30M</a>
      </CardFooter>

    </Card>
  )
}

export default EmptyChatContainer