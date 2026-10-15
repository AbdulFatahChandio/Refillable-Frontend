"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  ReactElement,
  useRef,
  useCallback,
} from "react";
import {
  useCategories,
  useProducts,
} from "../hooks/product/useProducts";
import { useCollectionGetBySlug } from "../hooks/collection/useCollectionGetBySlug";
import { useCollections } from "../hooks/collection/useCollections";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { ProductType } from "../ts-types/generated";
import { useTranslation } from "react-i18next";
import CustomSelect from "../components/custom-select/custom-select";
import { useUserStore } from "../store/useUserStore";
import CollectionPageBanner from "../components/CollectionPageBanner";
import { VscSettings } from "react-icons/vsc";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { MdOutlineCancel } from "react-icons/md";
import useClickOutside from "../hooks/useClickOutside";
import { useCurrencyCode } from "@/src/hooks/useFormatPrice";
import { useMediaQuery } from "react-responsive";
import "swiper/css";

const pickVal = <T,>(opt: any, fallback?: T): T | undefined => {
  if (opt === undefined || opt === null) return fallback;
  if (typeof opt === "object" && "value" in opt) return opt.value as T;
  return opt as T;
};
const toBool = (v: any) =>
  typeof v === "boolean"
    ? v
    : v === "true"
      ? true
      : v === "false"
        ? false
        : undefined;
const isDefaultRange = (vals: [number, number], min: number, max: number) =>
  vals[0] === min && vals[1] === max;

type SortVal =
  | ""
  | "explore"
  | "new"
  | "newest"
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc";

type Filters = {
  sort: SortVal;
  specialOffer: "" | true | false; // "" => not selected
  noteId: number | ""; // SINGLE id
  price: [number, number];
  rangeDirty: boolean; // send price only when user narrowed range
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useAppRouter();
  const { isLoggedIn } = useUserStore();
  const currency = useCurrencyCode();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { modal, setModal, modalRef } = useClickOutside();
  const [view, setView] = useState<"list" | "column" | "grid">("grid");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const categorySwiperRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const [categoriesFit, setCategoriesFit] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const lastAppendedPageRef = useRef(0);
  const metaRef = useRef({ totalPages: 1, total: 0 });
  const { t, i18n } = useTranslation();
  // const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const { search, slug, id, success, orderId } = router.query;

  // Currency change must reset pagination in the same render cycle so the
  // active query becomes page=1 before React Query refetch runs.
  const [listCurrency, setListCurrency] = useState(currency);
  if (currency !== listCurrency) {
    setListCurrency(currency);
    setPage(1);
    setAllProducts([]);
    isLoadingMoreRef.current = false;
    lastAppendedPageRef.current = 0;
    metaRef.current = { totalPages: 1, total: 0 };
  }

  const collectionSlug = Array.isArray(slug)
    ? slug[0]
    : (slug as string | undefined);
  // Categories always pass ?id=; collections are slug-only (slug can change in admin)
  const isBestSellers = collectionSlug === "best-sellers" && !id;
  const isCollectionPage = !!collectionSlug && !id && !isBestSellers;
  const isCategoryPage = !isCollectionPage && !isBestSellers;

  // selected tab state
  const [activeCat, setActiveCat] = useState<null | number>(null);

  // 🔑 force re-mount controls on reset so placeholders show
  const [resetKey, setResetKey] = useState(0);

  // price constraints
  const MIN = 0;
  const MAX = 5000;

  // ------- FILTER STATE --------
  const [filters, setFilters] = useState<Filters>({
    sort: "",
    specialOffer: "",
    noteId: "",
    price: [MIN, MAX],
    rangeDirty: false,
  });
  const [priceInputs, setPriceInputs] = useState<[string, string]>([
    String(MIN),
    String(MAX),
  ]);
  const [priceMin, priceMax] = filters.price;

  useEffect(() => {
    // Payment gateway return: land on collections with success params → thank-you page
    if (orderId && (success === "true" || success === "false")) {
      router.replace(`/thank-you?orderId=${orderId}&success=${success}`);
    }
  }, [success, orderId, router]);

  // keep rangeDirty false if user returned to default range
  useEffect(() => {
    if (isDefaultRange(filters.price, MIN, MAX) && filters.rangeDirty) {
      setFilters((f) => ({ ...f, rangeDirty: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.price[0], filters.price[1]]);

  // options
  const sortOptions = [
    { value: "explore", label: t("Explore") },
    { value: "new", label: t("New Products") },
    { value: "newest", label: t("Newest") },
    { value: "name_asc", label: t("Sort By A–Z") },
    { value: "name_desc", label: t("Sort By Z–A") },
    { value: "price_asc", label: t("Price: Low to High") },
    { value: "price_desc", label: t("Price: High to Low") },
  ] as const;

  const discountOptions = [
    { value: true, label: t("Discount") },
    { value: false, label: t("No Discount") },
  ];

  const sharedFilterParams = {
    limit: 8,
    page,
    search: search || undefined,
    specialOffer:
      filters.specialOffer === ""
        ? undefined
        : (filters.specialOffer as boolean),
    noteIds: filters.noteId === "" ? undefined : (filters.noteId as number),
    ...(filters.rangeDirty
      ? { priceMin, priceMax }
      : {}),
  };

  // Collection by URL slug (admin-editable slug + name)
  const {
    data: collectionBySlug,
    isLoading: isLoadingCollection,
    isFetching: isFetchingCollection,
    refetch: refetchCollection,
  } = useCollectionGetBySlug(
    collectionSlug || "",
    {
      ...sharedFilterParams,
      sort: filters.sort || undefined,
    },
    {
      enabled: isCollectionPage,
    },
  );
  const { data: collectionsData } = useCollections(
    { limit: 99 },
    { enabled: isCollectionPage },
  );
  const activeCollection = collectionsData?.data?.find(
    (collection) => collection.slug === collectionSlug,
  );

  // Best Sellers — products API with best_selling sort
  const {
    data: bestSellersData,
    isLoading: isLoadingBestSellers,
    isFetching: isFetchingBestSellers,
    refetch: refetchBestSellers,
  } = useProducts(
    isLoggedIn ? "user" : "public",
    {
      ...sharedFilterParams,
      sort: filters.sort || "best_selling",
    },
    { enabled: isBestSellers },
  );

  // Category / All — existing products API
  const {
    data: categoryProductsData,
    isLoading: isLoadingCategoryProducts,
    isFetching: isFetchingCategoryProducts,
    refetch: refetchCategoryProducts,
  } = useProducts(
    isLoggedIn ? "user" : "public",
    {
      ...sharedFilterParams,
      sort: filters.sort || undefined,
      ...(activeCat !== null ? { categoryId: activeCat } : {}),
    },
    { enabled: isCategoryPage },
  );

  const products: ProductType[] = useMemo(() => {
    if (isCollectionPage) {
      return (
        collectionBySlug?.data
          ?.map((item) => item.product)
          .filter((product): product is ProductType => Boolean(product)) ?? []
      );
    }
    if (isBestSellers) return bestSellersData?.data ?? [];
    return categoryProductsData?.data ?? [];
  }, [
    isCollectionPage,
    isBestSellers,
    collectionBySlug,
    bestSellersData,
    categoryProductsData,
  ]);

  const isLoading = isCollectionPage
    ? isLoadingCollection
    : isBestSellers
      ? isLoadingBestSellers
      : isLoadingCategoryProducts;

  const isFetching = isCollectionPage
    ? isFetchingCollection
    : isBestSellers
      ? isFetchingBestSellers
      : isFetchingCategoryProducts;

  // Keep last known meta so hasMore doesn't flicker while next page loads
  const currentMeta = isCollectionPage
    ? collectionBySlug?.meta
    : isBestSellers
      ? bestSellersData?.meta
      : categoryProductsData?.meta;
  if (currentMeta) {
    metaRef.current = {
      totalPages: currentMeta.totalPages || 1,
      total: currentMeta.total ?? 0,
    };
  }

  const totalPages = metaRef.current.totalPages;
  const total = metaRef.current.total;

  const refetch = isCollectionPage
    ? refetchCollection
    : isBestSellers
      ? refetchBestSellers
      : refetchCategoryProducts;

  // notes
  // const { data: notesList } = useNotes();
  // const notesData = notesList?.data ?? [];

  // categories
  const { data: categoryList } = useCategories({
    limit: 999,
    depth: 3,
  });
  const categoriesData = categoryList?.data ?? [];

  const getCatName = (c: any) => {
    const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
    return (
      c?.translations?.find((t: any) => t.language === lang)?.name ??
      c?.translations?.find((t: any) => t.language === "en")?.name ??
      c?.translations?.[0]?.name ??
      ""
    );
  };

  // tabs array: "All" first + rest of categories
  const categoryTabs = useMemo(
    () => [
      // { id: null as null | number, label: t("All"), subcategories: null },
      ...categoriesData.map((c: any) => ({
        id: Number(c.id),
        label: c,
        subcategories: c.subcategories,
      })),
    ],
    [categoriesData, i18n.language],
  );

  const measureCategoriesFit = useCallback(() => {
    const root = categorySwiperRef.current;
    if (!root) return;

    const slides = Array.from(
      root.querySelectorAll<HTMLElement>(".swiper-slide"),
    );
    if (!slides.length) {
      setCategoriesFit(false);
      return;
    }

    const spaceBetween = 0;
    const totalWidth =
      slides.reduce((sum, slide) => sum + slide.offsetWidth, 0) +
      spaceBetween * Math.max(0, slides.length - 1);
    const containerWidth = root.clientWidth;

    setCategoriesFit(totalWidth <= containerWidth + 1);
  }, []);

  useEffect(() => {
    measureCategoriesFit();

    const root = categorySwiperRef.current;
    if (!root) return;

    const resizeObserver = new ResizeObserver(() => {
      measureCategoriesFit();
    });
    resizeObserver.observe(root);

    window.addEventListener("resize", measureCategoriesFit);
    const frame = requestAnimationFrame(() => measureCategoriesFit());

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureCategoriesFit);
      cancelAnimationFrame(frame);
    };
  }, [measureCategoriesFit, categoryTabs, i18n.language]);

  // Close subcategory panel when navigating to another collection/category
  useEffect(() => {
    setActiveIndex(null);
  }, [slug, id, search]);

  // Mobile: tap outside category nav to close subcategory panel
  useEffect(() => {
    if (!isMobile || activeIndex === null) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!categoryNavRef.current?.contains(e.target as Node)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMobile, activeIndex]);

  const getTranslation = (
    translations: any[] = [],
    key: "name" | "description",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  // const optionsNotes = useMemo(
  //   () =>
  //     notesData.map((n: any) => ({
  //       value: Number(n.id),
  //       label: getTranslation(n.translations, "name", i18n.language),
  //       description: getTranslation(
  //         n.translations,
  //         "description",
  //         i18n.language
  //       ),
  //     })),
  //   [notesData, i18n.language]
  // );

  /** reset pagination when filters, route, or currency change */
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    isLoadingMoreRef.current = false;
    lastAppendedPageRef.current = 0;
    metaRef.current = { totalPages: 1, total: 0 };
  }, [
    search,
    collectionSlug,
    currency,
    filters.sort,
    filters.specialOffer,
    filters.noteId,
    filters.rangeDirty,
    priceMin,
    priceMax,
    activeCat,
  ]);

  // append current page once fetch settles
  useEffect(() => {
    if (isFetching) return;

    if (page === 1 && products.length === 0 && !isLoading) {
      setAllProducts([]);
      lastAppendedPageRef.current = 0;
      isLoadingMoreRef.current = false;
      return;
    }

    if (!products.length) return;

    // Same page already loaded — merge refreshed data (e.g. wishlist toggle)
    if (lastAppendedPageRef.current === page) {
      if (page === 1) {
        setAllProducts(products);
      } else {
        setAllProducts((prev) => {
          const byId = new Map(products.map((p) => [p.id, p]));
          return prev.map((p) => byId.get(p.id) ?? p);
        });
      }
      return;
    }

    setAllProducts((prev) => (page === 1 ? products : [...prev, ...products]));
    lastAppendedPageRef.current = page;
    isLoadingMoreRef.current = false;
  }, [products, isFetching, isLoading, page]);

  const handlePageClick = useCallback(() => {
    if (isLoadingMoreRef.current || isFetching) return;
    setPage((prev) => {
      if (prev >= totalPages) return prev;
      isLoadingMoreRef.current = true;
      return prev + 1;
    });
  }, [isFetching, totalPages]);

  const resetFilters = () => {
    setFilters({
      sort: "",
      specialOffer: "",
      noteId: "",
      price: [MIN, MAX],
      rangeDirty: false,
    });
    setPriceInputs([String(MIN), String(MAX)]);
    setPage(1);
    setResetKey((k) => k + 1);
    Promise.resolve().then(() => {
      void refetch();
    });
  };

  const applyPriceInput = (index: 0 | 1) => {
    const parsedValue = Number(priceInputs[index]);
    const fallback = index === 0 ? MIN : MAX;
    const boundedValue = Number.isFinite(parsedValue)
      ? Math.max(MIN, parsedValue)
      : fallback;
    const nextPrice: [number, number] = [...filters.price];

    nextPrice[index] =
      index === 0
        ? Math.min(boundedValue, nextPrice[1])
        : Math.max(boundedValue, nextPrice[0]);

    setPriceInputs([String(nextPrice[0]), String(nextPrice[1])]);
    setFilters((current) => ({
      ...current,
      price: nextPrice,
      rangeDirty: !isDefaultRange(nextPrice, MIN, MAX),
    }));
  };

  const getAllCategories = (categories: any): any[] => {
    return categories.flatMap((cat: any) => [
      cat,
      ...(cat.subcategories ? getAllCategories(cat.subcategories) : []),
    ]);
  };
  const allCategories = getAllCategories(categoriesData);

  useEffect(() => {
    if (!slug || isCollectionPage || isBestSellers) {
      setActiveCat(null);
      return;
    }

    setActiveCat(allCategories.find((c: any) => c?.id == id)?.id);
  }, [slug, categoriesData, id, isCollectionPage, isBestSellers]);

  const findCategoryById = (items: any[], id: any): any | null => {
    for (const item of items) {
      if (item.id == id) return item;

      if (item.subcategories?.length > 0) {
        const found = findCategoryById(item.subcategories, id);
        if (found) return found;
      }
    }
    return null;
  };

  const category = isCategoryPage
    ? findCategoryById(categoriesData, id)
    : null;

  const pageTitle = search
    ? String(search)
    : isCollectionPage
      ? getTranslation(activeCollection?.translations, "name") ||
        (collectionSlug || "")
          .split("-")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : isBestSellers
        ? t("Our Best Sellers")
        : getTranslation(category?.translations, "name") || t("Collections");

  const bannerImage = isCollectionPage
    ? activeCollection?.image
    : category?.image;

  const openCategoryPanel = (index: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveIndex(index);
  };

  const scheduleCloseCategoryPanel = () => {
    if (isMobile) return;
    hoverTimeout.current = setTimeout(() => {
      setActiveIndex(null);
    }, 200);
  };

  const handleCategoryClick = (
    index: number,
    enSlug: string,
    item: (typeof categoryTabs)[number],
  ) => {
    const hasSubs = (item?.subcategories?.length || 0) > 0;

    // Mobile: first tap opens subcategories; second tap on same tab goes to category
    if (isMobile && hasSubs) {
      if (activeIndex === index) {
        router.push(`/collections/${enSlug}?id=${item?.id}`);
        setActiveIndex(null);
      } else {
        openCategoryPanel(index);
      }
      return;
    }

    router.push(`/collections/${enSlug}?id=${item?.id}`);
    setActiveIndex(null);
  };

  return (
    <div className="lg:pb-24 pb-10">
      <div ref={categoryNavRef} className="relative py-3 bg-brown">
        <div ref={categorySwiperRef} className="max-w-[90%] mx-auto">
          <Swiper
            key={`collections-swiper-${i18n.language}-${categoryTabs.length}`}
            slidesPerView={"auto"}
            spaceBetween={0}
            freeMode={true}
            modules={[FreeMode]}
            onAfterInit={measureCategoriesFit}
            onResize={measureCategoriesFit}
            onUpdate={measureCategoriesFit}
            className={`mySwiper text-lg text-white ${
              categoriesFit ? "collection-swiper" : ""
            }`}
          >
          {categoryTabs.map((item, index: any) => {
            const enSlug = item?.label?.translations
              ?.find((tr: any) => tr.language === "en")
              ?.name?.toLowerCase()
              ?.split(" ")
              .join("-");
            const isActive = Boolean(slug?.includes(enSlug));
            const hasSubs = (item?.subcategories?.length || 0) > 0;
            const isPanelOpen = activeIndex === index && hasSubs;

            return (
              <SwiperSlide key={item.id ?? index} className="!inline-block !w-auto">
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`cursor-pointer capitalize max-sm:text-sm px-3 py-1 border-b-2 transition-colors ${
                      isActive || isPanelOpen
                        ? "border-white text-white"
                        : "border-transparent text-white/80 hover:text-white hover:border-white/50"
                    }`}
                    onMouseEnter={() => {
                      if (isMobile || !hasSubs) return;
                      openCategoryPanel(index);
                    }}
                    onClick={() => handleCategoryClick(index, enSlug, item)}
                    onMouseLeave={scheduleCloseCategoryPanel}
                    aria-expanded={isPanelOpen}
                  >
                    {getTranslation(item?.label?.translations, "name")}
                  </button>
                  {index < categoryTabs.length - 1 && (
                    <span
                      aria-hidden
                      className="mx-1 h-4 w-px shrink-0 bg-white/40"
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
          </Swiper>
        </div>

        <div
          className={`absolute grid md:divide-x divide-gray-300 grid-cols-12 md:py-10 py-4 left-0 top-full transition duration-500 w-full z-[9999] bg-secondary text-primary overflow-hidden shadow-[0px_100px_100px_rgba(0,0,0,0.25)] border-t border-gray-300
              ${activeIndex !== null && categoryTabs[activeIndex]?.subcategories?.length > 0 ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0 pointer-events-none"}`}
          onMouseEnter={() => {
            if (isMobile) return;
            if (hoverTimeout.current) {
              clearTimeout(hoverTimeout.current);
            }
          }}
          onMouseLeave={scheduleCloseCategoryPanel}
        >
          {isMobile &&
            activeIndex !== null &&
            categoryTabs[activeIndex]?.subcategories?.length > 0 && (
              <div className="col-span-12 flex items-center justify-between px-4 pb-3 mb-1 border-b border-gray-200">
                <button
                  type="button"
                  className="text-[12px] font-semibold uppercase underline"
                  onClick={() => {
                    const item = categoryTabs[activeIndex];
                    const enSlug = item?.label?.translations
                      ?.find((tr: any) => tr.language === "en")
                      ?.name?.toLowerCase()
                      ?.split(" ")
                      .join("-");
                    router.push(`/collections/${enSlug}?id=${item?.id}`);
                    setActiveIndex(null);
                  }}
                >
                  {t("View all", { defaultValue: "View all" })}{" "}
                  {getTranslation(
                    categoryTabs[activeIndex]?.label?.translations,
                    "name",
                  )}
                </button>
                <button
                  type="button"
                  className="text-[12px] uppercase px-2 py-1"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close"
                >
                  {t("Close", { defaultValue: "Close" })}
                </button>
              </div>
            )}
          <div className={` ${categoryTabs[activeIndex]?.subcategories?.find(
            (subCategory: any) => subCategory?.subcategories?.length > 0,
          ) ? "md:col-span-5 col-span-12" : "md:col-span-12 col-span-12"}`}>
            <div className="grid grid-cols-3 md:flex md:flex-wrap items-start gap-x-3 gap-y-5 md:gap-8 md:px-10 px-4 pt-4 md:pt-0 max-h-[60vh] overflow-y-auto">
              {categoryTabs[activeIndex]?.subcategories?.map(
                (subCategory: any, i: number) => (
                  <button
                    key={i + 1}
                    className="text-center block group max-sm:text-[12px] capitalize leading-tight"
                    onClick={() => {
                      router.push(
                        `/collections/${categoryTabs[
                          activeIndex
                        ]?.label?.translations
                          ?.find((tr: any) => tr.language === "en")
                          ?.name?.toLowerCase()
                          ?.split(" ")
                          .join("-")}/${subCategory?.translations
                            ?.find((tr: any) => tr.language === "en")
                            ?.name?.toLowerCase()
                            ?.split(" ")
                            .join("-")}?id=${subCategory?.id}`,
                      );
                      setActiveIndex(null);
                    }}
                  >
                    <img
                      src={subCategory?.image || "/assets/images/defaultImage2.svg"}
                      alt={getTranslation(subCategory?.translations, "name")}
                      className="md:w-20 md:h-20 w-14 h-14 border border-gray-300 rounded-full bg-light-brown/20 object-cover mb-2 mx-auto shadow-md group-hover:shadow-lg duration-500 shadow-gray-400"
                    />
                    {getTranslation(subCategory?.translations, "name")}
                  </button>
                ),
              )}
            </div>
          </div>
          {categoryTabs[activeIndex]?.subcategories?.find(
            (subCategory: any) => subCategory?.subcategories?.length > 0,
          ) && (
              <div className="md:col-span-7 col-span-12">
                <div className="md:px-10 px-4 pt-5 mt-4 md:mt-0 md:pt-0 max-md:border-t max-md:border-gray-200 max-h-[60vh] overflow-y-auto">
                  {categoryTabs[activeIndex]?.subcategories
                    ?.filter(
                      (subCategory: any) =>
                        subCategory?.subcategories?.length > 0,
                    )
                    .map((subCategory: any, i: number) => (
                      <div className="mb-6 last:mb-2" key={i}>
                        <span
                          key={i + 1}
                          className="group max-sm:text-[12px] uppercase font-semibold mb-4 block"
                        >
                          {getTranslation(subCategory?.translations, "name")}
                        </span>
                        <div className="grid grid-cols-3 md:flex md:flex-wrap items-start gap-x-3 gap-y-5 md:gap-8">
                          {subCategory?.subcategories?.length > 0 &&
                            subCategory?.subcategories?.map(
                              (subcategory: any, i: number) => (
                                <button
                                  key={i + 2}
                                  className="text-center group max-sm:text-[12px] capitalize leading-tight"
                                  onClick={() => {
                                    router.push(
                                      `/collections/${categoryTabs[
                                        activeIndex
                                      ]?.label?.translations
                                        ?.find((tr: any) => tr.language === "en")
                                        ?.name?.toLowerCase()
                                        ?.split(" ")
                                        .join("-")}/${subCategory?.translations
                                          ?.find((tr: any) => tr.language === "en")
                                          ?.name?.toLowerCase()
                                          ?.split(" ")
                                          .join("-")}/${subcategory?.translations
                                            ?.find((tr: any) => tr.language === "en")
                                            ?.name?.toLowerCase()
                                            ?.split(" ")
                                            .join("-")}?id=${subcategory?.id}`,
                                    );
                                    setActiveIndex(null);
                                  }}
                                >
                                  <img
                                    src={subcategory?.image}
                                    alt={getTranslation(
                                      subcategory?.translations,
                                      "name",
                                    )}
                                    className="md:w-20 md:h-20 w-14 h-14 rounded-full bg-gray-100 object-cover mb-2 mx-auto shadow-md group-hover:shadow-lg shadow-gray-400"
                                  />
                                  {getTranslation(
                                    subcategory?.translations,
                                    "name",
                                  )}
                                </button>
                              ),
                            )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>

      <CollectionPageBanner title={pageTitle} image={bannerImage} />

      <div className="container-fluid mt-10 relative">
        <div
          ref={modalRef}
          className={`flex flex-col md:gap-10 gap-5 fixed overflow-y-auto end-0 z-[99999] h-screen md:min-w-[400px] min-w-[300px] bg-white px-5 py-20 top-0 shadow-2xl
        ${modal ? "translate-x-0 transition duration-500" : "ltr:translate-x-full rtl:-translate-x-full duration"}`}
        >
          <button
            type="button"
            className="absolute top-5"
            onClick={() => setModal(false)}
          >
            <MdOutlineCancel size={30} />
          </button>
          <CustomSelect
            key={`sort-${resetKey}`}
            label=""
            list={sortOptions}
            name="sortBy"
            placeholder={t("Sort option")}
            value={
              filters.sort
                ? sortOptions.find((o) => o.value === filters.sort)
                : null
            }
            onChange={(opt: any) => {
              setFilters((f) => ({
                ...f,
                sort: (pickVal<SortVal>(opt) ?? "") as SortVal,
              }));
              setModal(false);
            }}
          />

          <div className="shrink-0">
            <CustomSelect
              key={`disc-${resetKey}`}
              label=""
              list={discountOptions}
              name="SelectDiscount"
              placeholder={t("Select Discount")}
              value={
                filters.specialOffer === ""
                  ? null
                  : discountOptions.find(
                    (o) => o.value === filters.specialOffer,
                  )
              }
              onChange={(opt: any) => {
                setFilters((f) => ({
                  ...f,
                  specialOffer: (pickVal<boolean>(opt) ??
                    toBool(opt) ??
                    "") as any,
                }));
                setModal(false);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(["Min Price", "Max Price"] as const).map((label, index) => (
              <label key={label} className="flex flex-col gap-2 text-sm">
                <span>{t(label)}</span>
                <input
                  type="number"
                  min={MIN}
                  value={priceInputs[index]}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPriceInputs((current) => {
                      const next: [string, string] = [...current];
                      next[index] = value;
                      return next;
                    });
                  }}
                  onBlur={() => applyPriceInput(index as 0 | 1)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="w-full border border-[#D9D9D9] bg-white px-3 md:py-[14px] py-2 outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setModal(false);
              }}
              className="bg-secondary hover:bg-primary border w-full border-[#D9D9D9] text-primary hover:text-secondary transition-all cursor-pointer px-2 py-[14px] font-semibold uppercase text-[13px]"
            >
              {t("Reset Filter")}
            </button>
          </div>
        </div>

        {search && (
          <p className="mb-5 max-sm:text-sm">
            {t("Search result for")}{" "}
            <i className="font-semibold capitalize">&quot;{search}&quot;</i>
          </p>
        )}

        <div className="flex md:gap-10 max-md:flex-col gap-4 relative items-start">
          <div
            className={`md:sticky top-10 flex justify-end items-center md:mb-10 gap-2 flex-wrap-reverse`}
          >
            <button
              className="flex items-center gap-2 border border-[#D9D9D9] max-sm:text-[12px] md:py-3 py-2 md:px-6 px-3 font-medium"
              onClick={() => setModal(!modal)}
            >
              <VscSettings className="md:size-6 size-4" />
              {t("Filters")}
            </button>
          </div>

          {children && React.isValidElement(children) && (
            <div className="grow max-md:w-full">
              {React.cloneElement(children as ReactElement<any>, {
                products: allProducts,
                view,
                isLoading: isLoading && allProducts.length === 0,
                isFetchingMore: isFetching && allProducts.length > 0,
                page,
                totalPages,
                total,
                handlePageClick,
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
