import { useEffect, useRef } from "react";

export default function useEffectAfterMount(
  fxn: () => void,
  dependencies: any[] = []
) {
    const isMounted = useRef(false);

    useEffect(()=>{
        if(isMounted.current===false){
            isMounted.current = true;
            return ;
        }

        fxn();
    },dependencies)
}
