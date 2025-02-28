import React from 'react';
import sizes from './sizes.module.scss'
export const DEVICES = {
    isPhoneSmall: (width: number): boolean => width <= parseInt(sizes.maxPhoneSmall),
    isPhone: (width: number): boolean => width <= parseInt(sizes.maxPhone),
    isTablet: (width: number): boolean => width <= parseInt(sizes.maxTablet) && width >= parseInt(sizes.minTablet),
    isLg: (width: number): boolean => width >= parseInt(sizes.minLg),
    isLessLg: (width: number): boolean => width <= parseInt(sizes.maxLg),
    isXlg: (width: number): boolean => width <= parseInt(sizes.maxXlg) && width >= parseInt(sizes.minXlg),
    isMoreXlg: (width: number): boolean => width >= parseInt(sizes.minXlg),
}

export const useSubscribeToWidth = (hasWidth = false): number => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const unmounted = React.useRef(false);

    React.useEffect(() => {
        if (hasWidth) {
            return;
        }
        const handleResize = (): void => {
            if (unmounted.current) {
                return;
            }
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);

        return (): void => {
            unmounted.current = true;
            window.removeEventListener('resize', handleResize);
        };
    }, [hasWidth])
    return width;
};

type WidthContextParams = {
    width: number | null;
}

const initialValue: WidthContextParams = {
    width: null
}

const WidthContext = React.createContext<WidthContextParams>(initialValue);

type WidthProviderProps = {
    children?: React.ReactNode;
}

export const WidthProvider: React.FC<WidthProviderProps> = ({
    children
}: WidthProviderProps) => {
    const width = useSubscribeToWidth();

    return (
        <WidthContext.Provider value={{ width }}>{children}</WidthContext.Provider>
    )
}

export const useWidth = (): {
    width: number;
    isPhoneSmall: boolean;
    isPhone: boolean;
    isTablet: boolean;
    isLg: boolean;
    isXlg: boolean;
    isLessLg: boolean;
    isMoreXlg: boolean;
} => {
    const { width: contextWidth } = React.useContext(WidthContext);

    const subscribedWidth = useSubscribeToWidth(contextWidth !== null);

    const width = contextWidth !== null ? contextWidth : subscribedWidth;

    const isPhoneSmall = DEVICES.isPhoneSmall(width);
    const isPhone = DEVICES.isPhone(width);
    const isTablet = DEVICES.isTablet(width);
    const isLg = DEVICES.isLg(width);
    const isXlg = DEVICES.isXlg(width);
    const isLessLg = DEVICES.isLessLg(width);
    const isMoreXlg = DEVICES.isMoreXlg(width);
    return { width, isPhoneSmall, isPhone, isTablet, isLg, isXlg, isLessLg, isMoreXlg }
}