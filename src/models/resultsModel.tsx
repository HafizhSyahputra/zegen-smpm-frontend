
export interface IResultsModel {  
    no: string;  
    type: string;  
    date: string;  
    mid: string;  
    tid: string;  
    status: string;  
    merchant_name: string;  
    address1: string;  
    address2: string;  
    address3: string;  
    address4: string;  
    merchant_category: string;  
    ownership: string;  
}  

export interface IFormInputImportResults {  
    files: File;  
}  

// Ini adalah interface baru yang kita tambahkan
export interface IFormImportResultsProps {  
    onFinish?: (values: IFormInputImportResults) => void;  
    initialValues?: IFormInputImportResults;  
    isLoading?: boolean;  
    onReset?: () => void;  
} 
