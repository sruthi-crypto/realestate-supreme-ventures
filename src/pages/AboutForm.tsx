import { useState, useEffect } from "react";
import {
    X,
    Info,
    Image,
    Star,
    Plus,
    Trash2,
    UploadCloud,
    QrCode,
} from "lucide-react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    createAboutAction,
    updateAboutAction,
    clearCreateAboutAction,
    clearUpdateAboutAction,
} from "@/store/actions";
import { uploadFilesToSupabase } from "@/supabase";
import { toast } from "sonner";
import { GetAboutResponse } from "@/types/responses";

interface Props {
    initialData?: GetAboutResponse["data"][number] | null;
    onCancel: () => void;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputClass =
    "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary border-border";

const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

const SectionHeader = ({
    icon: Icon,
    title,
    collapsible,
    open,
    onToggle,
}: {
    icon: any;
    title: string;
    collapsible?: boolean;
    open?: boolean;
    onToggle?: () => void;
}) => (
    <div
        className={`flex items-center gap-2 mb-4 ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? onToggle : undefined}
    >
        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary/10">
            <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">{title}</span>
        <div className="flex-1 h-px bg-border/60 ml-1" />
        {/* {collapsible && (
            <span className="text-muted-foreground">
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
        )} */}
    </div>
);

// ─── Validation ───────────────────────────────────────────────────────────────

const highlightSchema = Yup.object({
    label: Yup.string().optional(),
    value: Yup.string().optional(),
});

// const linkSchema = Yup.object({
//     label: Yup.string().optional(),
//     href: Yup.string().optional(),
// });

// const linkGroupSchema = Yup.object({
//     title: Yup.string().optional(),
//     links: Yup.array(linkSchema).optional(),
// });

// const contactSchema = Yup.object({
//     label: Yup.string().optional(),
//     value: Yup.string().optional(),
// });

// const socialSchema = Yup.object({
//     platform: Yup.string().optional(),
//     href: Yup.string().url("Must be a valid URL").optional(),
// });

const validationSchema = Yup.object({
    aboutUs: Yup.object({
        eyebrow: Yup.string().optional(),
        title: Yup.string().optional(),
        description: Yup.string().optional(),
        mission: Yup.string().optional(),
        since: Yup.string().optional(),
        highlights: Yup.array(highlightSchema).optional(),
    }).optional(),

    // footer: Yup.object({
    //     logoUrl: Yup.string().url("Must be a valid URL").optional(),
    //     brandName: Yup.string().optional(),
    //     tagline: Yup.string().optional(),
    //     rightsText: Yup.string().optional(),
    //     madeInLabel: Yup.string().optional(),
    //     ctaLabel: Yup.string().optional(),
    //     ctaHref: Yup.string().optional(),
    //     linkGroups: Yup.array(linkGroupSchema).optional(),
    //     contacts: Yup.array(contactSchema).optional(),
    //     socials: Yup.array(socialSchema).optional(),
    // }).optional(),
});

// ─── Default values ───────────────────────────────────────────────────────────

const defaultValues = {
    aboutUs: {
        eyebrow: "",
        title: "",
        description: "",
        mission: "",
        since: "",
        highlights: [] as { label: string; value: string }[],
    },
    qr: [] as { url: string; label: string }[],
    // footer: {
    //     logoUrl: "",
    //     brandName: "",
    //     tagline: "",
    //     rightsText: "",
    //     madeInLabel: "",
    //     ctaLabel: "",
    //     ctaHref: "",
    //     linkGroups: [] as { title: string; links: { label: string; href: string }[] }[],
    //     contacts: [] as { label: string; value: string }[],
    //     socials: [] as { platform: string; href: string }[],
    // },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-2"
    >
        <Plus className="w-3.5 h-3.5" /> {label}
    </button>
);

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors mt-1"
        aria-label="Remove"
    >
        <Trash2 className="w-3.5 h-3.5" />
    </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AboutForm = ({ initialData, onCancel }: Props) => {
    // const [footerOpen, setFooterOpen] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [uploadingQr, setUploadingQr] = useState(false);

    const {
        loading: createLoading,
        successData: createSuccess,
        error: createError,
        errorInfo: createErrorInfo,
    } = useAppSelector((s) => s.createAboutReducer);

    const {
        loading: updateLoading,
        successData: updateSuccess,
        error: updateError,
        errorInfo: updateErrorInfo,
    } = useAppSelector((s) => s.updateAboutReducer);

    const [uploadingLocal, setUploadingLocal] = useState(false);

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: defaultValues,
        validationSchema,
        onSubmit: (values) => {
            const clean = (obj: any): any => {
                if (Array.isArray(obj)) return obj.map(clean);
                if (obj && typeof obj === "object") {
                    return Object.fromEntries(
                        Object.entries(obj)
                            .map(([k, v]) => [k, clean(v)])
                            .filter(([, v]) => v !== "" && v !== undefined && v !== null)
                    );
                }
                return obj;
            };

            const payload = {
                ...clean(values),
                aboutUs: {
                    ...clean(values.aboutUs),
                    images: uploadedImages.map((url) => ({ url, alt: "" })),
                    qr: values.qr.filter(q => q.url),
                },
            };

            if (initialData) {
                dispatch(updateAboutAction({
                    endPoint: `real-state-site-content`,
                    ...payload,
                }));
            } else {
                dispatch(createAboutAction(payload));
            }
        },
    });

    // Sync preview with uploaded images
    useEffect(() => {
        setImagePreviewUrls(uploadedImages);
    }, [uploadedImages]);

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            formik.setValues({
                aboutUs: {
                    eyebrow: initialData.aboutUs?.eyebrow || "",
                    title: initialData.aboutUs?.title || "",
                    description: initialData.aboutUs?.description || "",
                    mission: initialData.aboutUs?.mission || "",
                    since: initialData.aboutUs?.since || "",
                    highlights: initialData.aboutUs?.highlights ?? [],
                },
                qr: (initialData.aboutUs?.qr ?? []).map((q: any) => ({ url: q.url || "", label: q.label || "" })),
                // footer: {
                //     logoUrl: initialData.footer?.logoUrl || "",
                //     brandName: initialData.footer?.brandName || "",
                //     tagline: initialData.footer?.tagline || "",
                //     rightsText: initialData.footer?.rightsText || "",
                //     madeInLabel: initialData.footer?.madeInLabel || "",
                //     ctaLabel: initialData.footer?.ctaLabel || "",
                //     ctaHref: initialData.footer?.ctaHref || "",
                //     linkGroups: initialData.footer?.linkGroups ?? [],
                //     contacts: initialData.footer?.contacts ?? [],
                //     socials: initialData.footer?.socials ?? [],
                // },
            });
            // Pre-populate uploaded images from existing data
            const existingImageUrls = (initialData.aboutUs?.images ?? []).map((img: any) =>
                typeof img === "string" ? img : img.url
            ).filter(Boolean);
            setUploadedImages(existingImageUrls);
        }
    }, [initialData]);

    // (Image uploads are handled locally via Supabase)

    // Create success/error
    useEffect(() => {
        if (createSuccess) {
            toast.success("About content created successfully");
            dispatch(clearCreateAboutAction());
            onCancel();
        }
        if (createError) toast.error(createErrorInfo);
    }, [createSuccess, createError, createErrorInfo, dispatch, onCancel]);

    // Update success/error
    useEffect(() => {
        if (updateSuccess) {
            toast.success("About content updated successfully");
            dispatch(clearUpdateAboutAction());
            onCancel();
        }
        if (updateError) toast.error(updateErrorInfo);
    }, [updateSuccess, updateError, updateErrorInfo, dispatch, onCancel]);

    const isLoading = createLoading || updateLoading;

    const FieldError = ({ name }: { name: string }) => {
        const keys = name.split(".");
        let touched: any = formik.touched;
        let error: any = formik.errors;
        for (const k of keys) {
            touched = touched?.[k];
            error = error?.[k];
        }
        return touched && error && typeof error === "string" ? (
            <p className="text-xs text-red-500 mt-1">{error}</p>
        ) : null;
    };

    const { values, handleChange, handleBlur, setFieldValue } = formik;

    // ── Helpers for array fields ────────────────────────────────────────────────

    const addHighlight = () =>
        setFieldValue("aboutUs.highlights", [...values.aboutUs.highlights, { label: "", value: "" }]);
    const removeHighlight = (i: number) =>
        setFieldValue("aboutUs.highlights", values.aboutUs.highlights.filter((_, idx) => idx !== i));

    const addQr = () => setFieldValue("qr", [...values.qr, { url: "", label: "" }]);
    const removeQr = (i: number) => setFieldValue("qr", values.qr.filter((_, idx) => idx !== i));

    // const addContact = () =>
    //     setFieldValue("footer.contacts", [...values.footer.contacts, { label: "", value: "" }]);
    // const removeContact = (i: number) =>
    //     setFieldValue("footer.contacts", values.footer.contacts.filter((_, idx) => idx !== i));

    // const addSocial = () =>
    //     setFieldValue("footer.socials", [...values.footer.socials, { platform: "", href: "" }]);
    // const removeSocial = (i: number) =>
    //     setFieldValue("footer.socials", values.footer.socials.filter((_, idx) => idx !== i));

    // const addLinkGroup = () =>
    //     setFieldValue("footer.linkGroups", [
    //         ...values.footer.linkGroups,
    //         { title: "", links: [{ label: "", href: "" }] },
    //     ]);
    // const removeLinkGroup = (i: number) =>
    //     setFieldValue("footer.linkGroups", values.footer.linkGroups.filter((_, idx) => idx !== i));

    // const addLinkInGroup = (gi: number) => {
    //     const groups = [...values.footer.linkGroups];
    //     groups[gi] = { ...groups[gi], links: [...groups[gi].links, { label: "", href: "" }] };
    //     setFieldValue("footer.linkGroups", groups);
    // };
    // const removeLinkInGroup = (gi: number, li: number) => {
    //     const groups = [...values.footer.linkGroups];
    //     groups[gi] = { ...groups[gi], links: groups[gi].links.filter((_, idx) => idx !== li) };
    //     setFieldValue("footer.linkGroups", groups);
    // };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <FormikProvider value={formik}>
            <div className="space-y-0">
                {/* Header */}
                <div className="flex justify-between items-start pb-5 mb-6 border-b border-border">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                            {initialData ? "Edit About Content" : "Add About Content"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {initialData
                                ? "Update the about & footer details below"
                                : "Fill in the details for the about page and footer"}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-muted rounded-lg transition-colors mt-1 text-muted-foreground hover:text-foreground"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-7">
                    {/* ─── About Us ─────────────────────────────────────────────────── */}
                    <div>
                        <SectionHeader icon={Info} title="About Us" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Eyebrow Text</label>
                                <input
                                    name="aboutUs.eyebrow"
                                    value={values.aboutUs.eyebrow}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Who We Are"
                                    className={inputClass}
                                />
                                <FieldError name="aboutUs.eyebrow" />
                            </div>

                            <div>
                                <label className={labelClass}>Title</label>
                                <input
                                    name="aboutUs.title"
                                    value={values.aboutUs.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Your Trusted Real Estate Partner"
                                    className={inputClass}
                                />
                                <FieldError name="aboutUs.title" />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Description</label>
                                <textarea
                                    name="aboutUs.description"
                                    value={values.aboutUs.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={3}
                                    placeholder="Brief description about the company..."
                                    className={inputClass + " resize-none"}
                                />
                                <FieldError name="aboutUs.description" />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Mission Statement</label>
                                <textarea
                                    name="aboutUs.mission"
                                    value={values.aboutUs.mission}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={2}
                                    placeholder="e.g. To make property ownership accessible to all..."
                                    className={inputClass + " resize-none"}
                                />
                                <FieldError name="aboutUs.mission" />
                            </div>

                            <div>
                                <label className={labelClass}>Since (Year)</label>
                                <input
                                    name="aboutUs.since"
                                    value={values.aboutUs.since}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. 2010"
                                    className={inputClass}
                                />
                                <FieldError name="aboutUs.since" />
                            </div>
                        </div>
                    </div>

                    {/* ─── About Images (Upload) ─────────────────────────────────────── */}
                    <div>
                        <SectionHeader icon={Image} title="About Images" />
                        <div className="space-y-4">
                            {/* Upload Dropzone */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer group ${uploadingLocal
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-border hover:bg-muted/30 hover:border-primary/50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingLocal}
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;

                                        const fileArray = Array.from(files).filter(Boolean) as File[];
                                        setUploadingLocal(true);
                                        try {
                                            const uploaded = await uploadFilesToSupabase(fileArray);
                                            const urls = uploaded.map((u) => u.url).filter(Boolean);
                                            if (urls.length === 0) {
                                                toast.error("Upload failed: No URLs returned");
                                            } else {
                                                setUploadedImages((prev) => [...prev, ...urls]);
                                                toast.success("Images uploaded successfully");
                                            }
                                        } catch (err: any) {
                                            toast.error(err?.message || "Image upload failed");
                                        } finally {
                                            setUploadingLocal(false);
                                            e.target.value = "";
                                        }
                                    }}
                                />

                                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <UploadCloud className="w-7 h-7" />
                                </div>

                                <h3 className="text-sm font-semibold text-foreground mb-1">
                                    {uploadingLocal ? "Uploading images..." : "Click or drag images to upload"}
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                    Select multiple high-quality images to showcase your about page.
                                </p>

                                {uploadingLocal && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Processing files...
                                    </div>
                                )}
                            </div>

                            {/* Image Preview Grid */}
                            {imagePreviewUrls.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 animate-fade-in">
                                    {imagePreviewUrls.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group shadow-sm hover:shadow-md transition-all duration-200"
                                        >
                                            <img
                                                src={url}
                                                alt={`Preview ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setUploadedImages((prev) => prev.filter((_, index) => index !== i))
                                                }
                                                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-red-500 text-foreground hover:text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                                                title="Remove image"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {/* Image Number Indicator */}
                                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                                                {i + 1} / {imagePreviewUrls.length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── Highlights ───────────────────────────────────────────────── */}
                    <div>
                        <SectionHeader icon={Star} title="Highlights / Stats" />
                        <div className="space-y-3">
                            {values.aboutUs.highlights.map((h, i) => (
                                <div key={i} className="flex gap-2 items-start p-3 rounded-lg border border-border bg-muted/30">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Label</label>
                                            <input
                                                name={`aboutUs.highlights[${i}].label`}
                                                value={h.label}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. Properties Sold"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Value</label>
                                            <input
                                                name={`aboutUs.highlights[${i}].value`}
                                                value={h.value}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. 500+"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                    <RemoveButton onClick={() => removeHighlight(i)} />
                                </div>
                            ))}
                            <AddButton label="Add Highlight" onClick={addHighlight} />
                        </div>
                    </div>

                    {/* ─── Footer (collapsible) ─────────────────────────────────────── */}
                    {/* <div>
                        <SectionHeader
                            icon={Globe}
                            title="Footer Settings"
                            collapsible
                            open={footerOpen}
                            onToggle={() => setFooterOpen((p) => !p)}
                        />

                        {footerOpen && (
                            <div className="space-y-7">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>Logo URL</label>
                                        <input
                                            name="footer.logoUrl"
                                            value={values.footer.logoUrl}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="https://..."
                                            className={inputClass}
                                        />
                                        <FieldError name="footer.logoUrl" />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Brand Name</label>
                                        <input
                                            name="footer.brandName"
                                            value={values.footer.brandName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. DreamHome Realty"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Tagline</label>
                                        <input
                                            name="footer.tagline"
                                            value={values.footer.tagline}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. Find your dream home today"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Rights Text</label>
                                        <input
                                            name="footer.rightsText"
                                            value={values.footer.rightsText}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. © 2024 All rights reserved"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Made In Label</label>
                                        <input
                                            name="footer.madeInLabel"
                                            value={values.footer.madeInLabel}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. Made in India"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>CTA Label</label>
                                        <input
                                            name="footer.ctaLabel"
                                            value={values.footer.ctaLabel}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. Explore Properties"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>CTA Link</label>
                                        <input
                                            name="footer.ctaHref"
                                            value={values.footer.ctaHref}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. /properties"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader icon={Phone} title="Contact Details" />
                                    <div className="space-y-3">
                                        {values.footer.contacts.map((c, i) => (
                                            <div key={i} className="flex gap-2 items-start p-3 rounded-lg border border-border bg-muted/30">
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className={labelClass}>Label</label>
                                                        <input
                                                            name={`footer.contacts[${i}].label`}
                                                            value={c.label}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="e.g. Phone"
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Value</label>
                                                        <input
                                                            name={`footer.contacts[${i}].value`}
                                                            value={c.value}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="e.g. +91 9876543210"
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                </div>
                                                <RemoveButton onClick={() => removeContact(i)} />
                                            </div>
                                        ))}
                                        <AddButton label="Add Contact" onClick={addContact} />
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader icon={Share2} title="Social Links" />
                                    <div className="space-y-3">
                                        {values.footer.socials.map((s, i) => (
                                            <div key={i} className="flex gap-2 items-start p-3 rounded-lg border border-border bg-muted/30">
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className={labelClass}>Platform</label>
                                                        <input
                                                            name={`footer.socials[${i}].platform`}
                                                            value={s.platform}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="e.g. Instagram"
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>URL</label>
                                                        <input
                                                            name={`footer.socials[${i}].href`}
                                                            value={s.href}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="https://instagram.com/..."
                                                            className={inputClass}
                                                        />
                                                        <FieldError name={`footer.socials.${i}.href`} />
                                                    </div>
                                                </div>
                                                <RemoveButton onClick={() => removeSocial(i)} />
                                            </div>
                                        ))}
                                        <AddButton label="Add Social" onClick={addSocial} />
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader icon={Link2} title="Footer Link Groups" />
                                    <div className="space-y-4">
                                        {values.footer.linkGroups.map((group, gi) => (
                                            <div key={gi} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex-1">
                                                        <label className={labelClass}>Group Title</label>
                                                        <input
                                                            name={`footer.linkGroups[${gi}].title`}
                                                            value={group.title}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="e.g. Quick Links"
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                    <RemoveButton onClick={() => removeLinkGroup(gi)} />
                                                </div>

                                                <div className="space-y-2 pl-2 border-l-2 border-primary/20 ml-1">
                                                    {group.links.map((link, li) => (
                                                        <div key={li} className="flex gap-2 items-start">
                                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className={labelClass}>Link Label</label>
                                                                    <input
                                                                        name={`footer.linkGroups[${gi}].links[${li}].label`}
                                                                        value={link.label}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        placeholder="e.g. Home"
                                                                        className={inputClass}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className={labelClass}>Link Href</label>
                                                                    <input
                                                                        name={`footer.linkGroups[${gi}].links[${li}].href`}
                                                                        value={link.href}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        placeholder="e.g. /"
                                                                        className={inputClass}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <RemoveButton onClick={() => removeLinkInGroup(gi, li)} />
                                                        </div>
                                                    ))}
                                                    <AddButton label="Add Link" onClick={() => addLinkInGroup(gi)} />
                                                </div>
                                            </div>
                                        ))}
                                        <AddButton label="Add Link Group" onClick={addLinkGroup} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div> */}

                    {/* ─── QR Codes ─────────────────────────────────────────────────── */}
                    <div>
                        <SectionHeader icon={QrCode} title="Payment QR Codes" />
                        <div className="space-y-3">
                            {/* Upload QR */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer group ${
                                    uploadingQr ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/30 hover:border-primary/50"
                                }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingQr}
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;
                                        setUploadingQr(true);
                                        try {
                                            const uploaded = await uploadFilesToSupabase(Array.from(files) as File[]);
                                            const newQrs = uploaded.map(u => ({ url: u.url, label: "" })).filter(q => q.url);
                                            setFieldValue("qr", [...values.qr, ...newQrs]);
                                            toast.success("QR uploaded successfully");
                                        } catch (err: any) {
                                            toast.error(err?.message || "QR upload failed");
                                        } finally {
                                            setUploadingQr(false);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                                <QrCode className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-semibold text-foreground">
                                    {uploadingQr ? "Uploading QR..." : "Click to upload QR images"}
                                </p>
                                <p className="text-xs text-muted-foreground">Upload one or multiple payment QR codes</p>
                            </div>

                            {values.qr.map((q, i) => (
                                <div key={i} className="flex gap-2 items-start p-3 rounded-lg border border-border bg-muted/30">
                                    {q.url && (
                                        <img src={q.url} alt="QR" className="w-16 h-16 object-contain rounded border border-border bg-white flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <label className={labelClass}>Label (optional)</label>
                                        <input
                                            name={`qr[${i}].label`}
                                            value={q.label}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g. UPI / PhonePe"
                                            className={inputClass}
                                        />
                                    </div>
                                    <RemoveButton onClick={() => removeQr(i)} />
                                </div>
                            ))}
                            <AddButton label="Add QR manually" onClick={addQr} />
                        </div>
                    </div>

                    {/* ─── Actions ──────────────────────────────────────────────────── */}
                    <div className="flex gap-3 pt-2 border-t border-border">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
                            style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    {initialData ? "Updating..." : "Creating..."}
                                </span>
                            ) : initialData ? (
                                "Update Content"
                            ) : (
                                "Create Content"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-all duration-200 text-foreground"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </FormikProvider>
    );
};

export default AboutForm;