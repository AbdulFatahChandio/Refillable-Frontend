export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};



export type IPaginator<Data> = {
    data: Data[];
    meta: IPaginatorInfo;
    pages?: any;
};


export type IPaginatorInfo = {
    total: Scalars["Int"];
    lastPage?: Scalars["Int"];
    currentPage?: Scalars["Int"];
    limit?: Scalars["Int"];
    perPage?: Scalars["Int"];
    totalPages: Scalars["Int"];
    prev?: Scalars["Int"];
    next?: Scalars["Int"];
    unreadCount?: Scalars["Int"];
    page: Scalars["Int"];
};


export type TranslationsType = {
    language?: Scalars["String"];
    name?: Scalars["String"];
    title?: Scalars["String"];
    text?: Scalars["String"];
    description?: Scalars["String"];
    body?: Scalars["String"];
};


export type NoteType = {
    productId?: Scalars["Int"];
    noteId?: Scalars["Int"];
    note?: {
        translations: TranslationsType[] | any;
    };
};
export type CountryType = {
    translations: TranslationsType[];
};
export type flavourProfileType = {
    percentage: Scalars["Int"];
    translations: TranslationsType[];
};



export type CategoryType = {
    id?: Scalars["Int"];
    name?: Scalars["String"];
    image?: Scalars["String"];
    description?: Scalars["String"];
    translations: TranslationsType[] | any;
    subcategories?: CategoryType[];
};



export type ProductType = {
    id: Scalars["Int"];
    imageUrls: Scalars["String"][];
    productImageUrls?: Scalars["String"][];
    slug?: Scalars["String"] | null;
    finalAmountPerUnit?: Scalars["String"];
    categoryId?: Scalars["Int"];
    category: CategoryType | any;
    productCategories: CategoryType | any;
    limited?: Scalars["Boolean"];
    discount?: Scalars["Boolean"];
    isWishlisted?: Scalars["Boolean"];
    inStock?: Scalars["Boolean"];
    comingSoon?: Scalars["Boolean"];
    explore?: Scalars["Boolean"];
    discountPercent?: Scalars["Int"];
    price?: Scalars["Float"];
    priceBase?: Scalars["Float"];
    currency?: Scalars["String"];
    locale?: Scalars["String"];
    exchangeRate?: Scalars["Float"];
    exchangeRateAt?: Scalars["String"];
    amountInGrams?: Scalars["Int"];
    translations: TranslationsType[] | any;
    notes?: NoteType[];
    countryOrigins?: CountryType[];
    flavourProfiles?: flavourProfileType[];
    wishlist?: Scalars["Boolean"];
    quantity?: Scalars["Int"];
    specialOffer?: {
        id?: Scalars["Int"];
        name?: Scalars["String"];
        discountPercent?: Scalars["String"] | Scalars["Float"];
        discountedPrice?: Scalars["Float"];
    } | null;
    productVariants?: any;
    productFeatures?: any;
    selections?: any;
    skus?: any;
};

export type ProductCollectionType = {
    id?: Scalars["Int"];
    productId?: Scalars["Int"];
    collectionId?: Scalars["Int"];
    sortOrder?: Scalars["Int"];
    createdAt?: Scalars["String"];
    product?: ProductType;
};

export type CollectionType = {
    id?: Scalars["Int"];
    slug?: Scalars["String"];
    image?: Scalars["String"];
    isActive?: Scalars["Boolean"];
    sortOrder?: Scalars["Int"];
    startDate?: Scalars["String"] | null;
    endDate?: Scalars["String"] | null;
    createdAt?: Scalars["String"];
    updatedAt?: Scalars["String"];
    translations?: TranslationsType[] | any;
    products?: ProductType[];
};
export type SingleCollectionType = IPaginator<ProductCollectionType>;

export type PlatformType = {
    taxPercentage?: Scalars["String"];
    shippingFee?: Scalars["String"];
    shippingFeeExemptedAfter?: Scalars["String"];
};


export type OrderType = {
    id?: Scalars["Int"];
    status: Scalars["String"];
    orderNumber: Scalars["String"];
    discount?: Scalars["Int"];
    amount?: Scalars["Int"];
    subtotal?: Scalars["Int"];
    totalAmount?: Scalars["Int"];
    total?: Scalars["Int"];
    shippingFee?: Scalars["String"];
    discountedAmount?: Scalars["String"];
    taxAmount?: Scalars["String"];
    taxPercentage?: Scalars["String"];
    products?: ProductType[];
    items?: ProductType[];
    refund?: RefundType;
    trackingId: Scalars["String"];
    courierServiceProvider: Scalars["String"];
    smsaLabelBase64?: Scalars["String"] | null;
    createdAt: Scalars["String"];
    invoice: {
        pdfUrl: Scalars["String"];
    };
};

export type RefundType = {
    id?: Scalars["Int"];
    status?: Scalars["String"];
    amount?: Scalars["Int"];
    createdAt?: Scalars["String"];
};


export type AddressType = {
    id?: Scalars["Int"];
    firstName?: Scalars["String"];
    lastName?: Scalars["String"];
    addressLine1?: Scalars["String"];
    addressLine2?: Scalars["String"];
    city?: Scalars["String"];
    country?: Scalars["String"];
    email?: Scalars["String"];
    phone?: Scalars["String"];
    isDefault?: Scalars["Boolean"];

};


export type CountriesType = {
    name: Scalars["String"];
    code: Scalars["String"];
    id: Scalars["Int"];
};



export type LoginInputTypes = {
    firstName?: Scalars["String"];
    lastName?: Scalars["String"];
    role?: Scalars["String"];
    email: Scalars["String"];
    password: Scalars["String"];
};

export type SubscribeInputTypes = {
    email: Scalars["String"];
};
export type ProfileUpdateTypes = {
    firstName: Scalars["String"];
    lastName: Scalars["String"];
    phone: Scalars["String"];
};


export type ContactTypes = {
    firstName: Scalars["String"];
    lastName: Scalars["String"];
    email: Scalars["String"];
    contactNumber: Scalars["String"];
    subject: Scalars["String"];
    message?: Scalars["String"];
    imageUrl?: Scalars["String"];
};
export type ChangePasswordTypes = {
    oldPassword: Scalars["String"];
    newPassword: Scalars["String"];
    confirmPassword?: Scalars["String"];
};


export type AddAddressTypes = {
    id?: any;
    firstName?: Scalars["String"];
    lastName?: Scalars["String"];
    addressLine1?: Scalars["String"];
    addressLine2?: Scalars["String"];
    country?: Scalars["String"];
    city?: Scalars["String"];
    postalCode?: Scalars["String"];
    phone?: Scalars["String"];
    email?: Scalars["String"];
    isDefault?: Scalars["Boolean"];
};


export type SendOtpTypes = {
    email: Scalars["String"];
    purpose: Scalars["String"];
};


export type VerifyOtpTypes = {
    email: Scalars["String"];
    purpose: Scalars["String"];
    otp: Scalars["String"];
    deviceId: Scalars["String"];
    fcmToken: Scalars["String"];
};

export type ResetPasswordTypes = {
    email: Scalars["String"];
    otp: Scalars["String"];
    password: Scalars["String"];
    confirmPassword: Scalars["String"];
};


export type LoginResponse = {
    meta: {
        accessToken: Scalars["String"];
    }
    data: User;
    message: Scalars["String"];
};



export type User = {
    id?: Scalars["Int"];
    userId?: Scalars["Int"];
    firstName?: Scalars["String"];
    lastName?: Scalars["String"];
    email?: Scalars["String"];
    phone?: Scalars["String"];
    userNotificationPref?: {
        emailPromotional: Scalars["Boolean"];
        pushPromotional: Scalars["Boolean"];
        pushSystem: Scalars["Boolean"];
        emailSystem: Scalars["Boolean"];
    },
    isSocial?: Scalars["Boolean"];
}




export type NotificationType = {
    notification: {
        id?: Scalars["Int"];
        read?: Scalars["Boolean"];
        title?: Scalars["String"];
        body?: Scalars["String"];
        createdAt?: Scalars["String"];
        type?: Scalars["String"];
        orderId?: Scalars["Int"];
        productId?: Scalars["Int"];
        product?: ProductType;
        translations: TranslationsType[];
        identify: {
            link: Scalars["String"];
        }
    }
    read: Scalars["Boolean"];
    id?: Scalars["Int"];
};


export type CheckoutTypes = {
    email: Scalars["String"];
    note?: Scalars["String"];
};





export type ValidateCouponInputTypes = {
    email: Scalars["String"];
    code: Scalars["String"];
    cartSubtotal: Scalars["Int"];
};


export type ValidateCouponResponse = {
    data: {
        code?: Scalars["String"];
        type?: Scalars["String"];
        discountValue?: Scalars["String"];
        minCartSpend?: Scalars["String"];
        usageLimitGlobal?: Scalars["Int"];
        usedCountGlobal?: Scalars["Int"];
        usageLimitPerUser?: Scalars["Int"];
        startAt?: Scalars["String"];
        endAt?: Scalars["String"];
    };
};

export type ShippingQuotePreviewInput = {
    weightKg: Scalars["String"];
    country: Scalars["String"];
};

export type ShippingQuotePreviewData = {
    shippingFee: Scalars["Float"];
    shippingFeeBase: Scalars["Float"];
    currency: Scalars["String"];
    regionCode: Scalars["String"];
    countryCode: Scalars["String"];
    billableWeightKg: Scalars["Float"];
};

export type ShippingQuotePreviewResponse = {
    success?: Scalars["Boolean"];
    statusCode?: Scalars["Int"];
    data: ShippingQuotePreviewData;
};

export type ShippingQuoteCartItem = {
    productId: Scalars["Int"];
    quantity: Scalars["Int"];
};

export type ShippingQuoteInput = {
    cartItems: ShippingQuoteCartItem[];
    country: Scalars["String"];
    city: Scalars["String"];
    subtotal: Scalars["Float"];
};

export type ShippingQuoteData = {
    shippingFee: Scalars["Float"];
    shippingFeeBase: Scalars["Float"];
    currency: Scalars["String"];
    locale?: Scalars["String"];
    exchangeRate?: Scalars["Float"];
    exchangeRateAt?: Scalars["String"];
    weightKg?: Scalars["Float"];
    billableWeightKg: Scalars["Float"];
    regionCode: Scalars["String"];
    countryCode: Scalars["String"];
    serviceType?: Scalars["String"];
    source?: Scalars["String"];
    quoteToken: Scalars["String"];
    expiresAt?: Scalars["String"];
};

export type ShippingQuoteResponse = {
    success?: Scalars["Boolean"];
    statusCode?: Scalars["Int"];
    data: ShippingQuoteData;
};

export type ShippingCountryWiseFeesInput = {
    cartItems: ShippingQuoteCartItem[];
    countries: Scalars["String"][];
    city: Scalars["String"];
    subtotal: Scalars["Float"];
    includeQuoteToken: false;
};

export type ShippingCountryWiseFeeItem = {
    isDeliverable?: Scalars["Boolean"];
    countryCode: Scalars["String"];
    regionCode: Scalars["String"];
    serviceType?: Scalars["String"];
    weightKg?: Scalars["Float"];
    billableWeightKg?: Scalars["Float"];
    shippingFee: Scalars["Float"];
    shippingFeeBase?: Scalars["Float"];
    currency: Scalars["String"];
    source?: Scalars["String"];
};

export type ShippingCountryWiseFeesResponse = {
    success?: Scalars["Boolean"];
    statusCode?: Scalars["Int"];
    message?: Scalars["String"];
    data: {
        message?: Scalars["String"];
        items: ShippingCountryWiseFeeItem[];
    };
};


export type CartType = {
    productId: Scalars["Int"];
    quantity: Scalars["Int"];
}

export type OrderInputTypes = {
    shippingAddress: AddAddressTypes | any;
    billingAddress: AddAddressTypes | null | any;
    isBillingAddSameAsShippingAdd: Scalars["Boolean"];
    notes?: Scalars["String"];
    email: Scalars["String"];
    cartItems: CartType[];
    quoteToken?: Scalars["String"];
};


export type OrderResponse = {
    data: {
        orderId: Scalars["Int"];
        paymentUrl: Scalars["String"];
        paymentIntentId: Scalars["String"];
    };
    message: Scalars["String"];
};

export type TrackOrderInput = {
    orderTrackingId: Scalars["String"];
    email: Scalars["String"];
};
