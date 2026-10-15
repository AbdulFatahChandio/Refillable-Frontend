"use client";

// PhoneNumberField.tsx
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { isPossiblePhoneNumber } from 'react-phone-number-input' // optional live check
import { useTranslation } from 'react-i18next';

type PropTypes = {
    mainClassName?: string;
    labelClassName?: string;
    label?: string;
    errorClassName?: string;
    error?: string;
    value?: string;
    onChange: (value: any) => any,
    disabled?: boolean,
    onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void
}

const PhoneNumberField = ({
    mainClassName,
    labelClassName,
    label,
    error,
    errorClassName,
    value,
    onChange,
    onBlur,
    disabled,
    ...rest
}: PropTypes) => {

    // (optional) live "possible?" flag for inline message
    const showLiveLenError = value ? !isPossiblePhoneNumber(value) : false;
    const { t } = useTranslation();

    return (
        <div className={mainClassName}>
            {label && (
                <p className={`text-[#000000] text-md font-medium pb-2 ${labelClassName}`}>
                    {label}
                </p>
            )}

            <div className='phone-input-container'>
                <PhoneInput
                    placeholder="Enter phone number"
                    value={value}
                    defaultCountry="AE"
                    international
                    className='register-phone'
                    onChange={onChange}
                    disabled={disabled}
                    // 🔑 prevents over-typing for the selected country
                    limitMaxLength
                    // (optional) keep +971 locked so users can’t mangle it
                    countryCallingCodeEditable={true}
                    {...rest}
                    onBlur={onBlur}
                />
            </div>

            {/* Prefer Yup error; optionally show live length error while typing */}
            {error
                && <span className={`text-sm text-red-500 ${errorClassName}`}>{error}</span>
            }
        </div>
    )
}

export default PhoneNumberField
