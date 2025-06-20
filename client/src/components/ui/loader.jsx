import React from 'react'
import { MutatingDots } from 'react-loader-spinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

function Loader({ isLoading }) {
    return <>

        <Dialog open={isLoading} >
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className=" px-14 py-8 w-max">

                
                    <MutatingDots
                        className=" max-w-9"
                        visible={true}
                        height="100"
                        width="100"
                        secondaryColor="#E11D48"
                        radius="14.5"
                        ariaLabel="mutating-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        color='#E11D48' />
                <DialogTitle className="text-center">Loading</DialogTitle>
            </DialogContent>
        </Dialog>

    </>
}

export default Loader;