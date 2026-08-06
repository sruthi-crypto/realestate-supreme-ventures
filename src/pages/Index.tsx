import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGetAllPropertiesAction, getAllPropertiesAction, getAboutAction, cleargetAboutAction } from "@/store/actions";
import { toast } from "sonner";
import { PropertyData } from "@/types/responses";

const PROPERTY_TYPES = ["All", "Open Plots", "Apartments", "Gated Villas", "Gated Communities"];

const PLOT_OPTIONS = [
  { sqft: "0.4 sq.ft", price: 2500 },
  { sqft: "0.6 sq.ft", price: 3500 },
  { sqft: "8 sq.ft", price: 4500 },
  { sqft: "10 sq.ft", price: 5500 },
];

// ── Plot Booking Modal ────────────────────────────────────────────────────────
function PlotBookingModal({
  open,
  onClose,
  qrCodes,
}: {
  open: boolean;
  onClose: () => void;
  qrCodes: { url: string; label?: string }[];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<"select" | "qr">("select");
  const [selectedQr, setSelectedQr] = useState<number>(0);

  if (!open) return null;

  const handleClose = () => {
    setSelected(null);
    setStep("select");
    setSelectedQr(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-background shadow-2xl border border-border p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "select" ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-foreground">Book Your Plot</h3>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                ✕
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Select a plot size to proceed with payment</p>

            <div className="space-y-3 mb-6">
              {PLOT_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                    selected === i
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <span className="font-semibold text-foreground">{opt.sqft}</span>
                  <span className="font-bold text-primary">₹{opt.price.toLocaleString("en-IN")}</span>
                </button>
              ))}
            </div>

            <button
              disabled={selected === null}
              onClick={() => setStep("qr")}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              Continue Payment
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setStep("select")}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                ← Back
              </button>
              <h3 className="font-display text-lg font-bold text-foreground">Scan & Pay</h3>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                ✕
              </button>
            </div>

            {selected !== null && (
              <div className="text-center mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">Selected</p>
                <p className="font-bold text-foreground">
                  {PLOT_OPTIONS[selected].sqft} — ₹{PLOT_OPTIONS[selected].price.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            {qrCodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No QR codes available. Please contact admin.</div>
            ) : (
              <>
                {qrCodes.length > 1 && (
                  <div className="flex gap-2 flex-wrap justify-center mb-4">
                    {qrCodes.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedQr(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedQr === i ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {q.label || `QR ${i + 1}`}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={qrCodes[selectedQr]?.url}
                    alt={qrCodes[selectedQr]?.label || "Payment QR"}
                    className="w-56 h-56 object-contain rounded-xl border border-border bg-white p-2 shadow-md"
                  />
                  {qrCodes[selectedQr]?.label && (
                    <p className="text-sm font-semibold text-foreground">{qrCodes[selectedQr].label}</p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">Scan the QR code with any UPI app to complete your payment</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  productName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background shadow-2xl border border-border p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center border-4 border-red-100">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-2">Delete Property?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">"{productName}"</span>?
            <br />
            This action <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Index ─────────────────────────────────────────────────────────────────────
const Index = () => {
  const { isAdmin } = useApp();

  const dispatch = useAppDispatch();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [editingProduct, setEditingProduct] = useState<PropertyData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [qrCodes, setQrCodes] = useState<{ url: string; label?: string }[]>([]);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const {
    loading: getPropertiesLoading,
    successData: getPropertiesSuccess,
    error: getPropertiesError,
    errorInfo: getPropertiesErrorInfo,
  } = useAppSelector((s) => s.getAllPropertiesReducer);

  const {
    successData: getAboutSuccess,
  } = useAppSelector((s) => s.getAboutReducer);

  useEffect(() => {
    dispatch(getAllPropertiesAction());
    dispatch(getAboutAction());
  }, [dispatch]);

  useEffect(() => {
    if (getAboutSuccess) {
      const record = getAboutSuccess.data.find((d) => d.key === "aboutUs") ?? getAboutSuccess.data[0];
      setQrCodes(record?.qr ?? []);
      dispatch(cleargetAboutAction());
    }
  }, [getAboutSuccess, dispatch]);

  useEffect(() => {
    if (getPropertiesSuccess) {
      setProperties(getPropertiesSuccess.data);
      dispatch(clearGetAllPropertiesAction());
    }
  }, [getPropertiesSuccess, dispatch]);

  useEffect(() => {
    if (getPropertiesError) toast.error(getPropertiesErrorInfo || "Failed to fetch properties");
  }, [getPropertiesError, getPropertiesErrorInfo]);

  const handleDeleteClick = (product: PropertyData) => {
    setDeleteModal({ open: true, id: product.id, name: product.title });
  };

  const handleDeleteConfirm = () => {
    setProperties(properties.filter((p) => p.id !== deleteModal.id));
    setDeleteModal({ open: false, id: "", name: "" });
  };

  const isModalOpen = isCreating || !!editingProduct;

  const filteredproperties = properties.filter((p) => {
    if (selectedType !== "All" && p.propertyType !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <DeleteConfirmModal
        open={deleteModal.open}
        productName={deleteModal.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: "", name: "" })}
      />

      <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>
        <div className="container relative z-10 text-center">
          <div className="space-y-4 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
              Find Your Dream Property
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Explore premium plots, apartments, villas and communities across India's top cities with unparalleled luxury and elegance.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        {/* Admin Controls */}
        {isAdmin && !isCreating && !editingProduct && (
          <div className="mb-8 animate-slide-down">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover-lift font-semibold"
            >
              + Add Property
            </Button>
          </div>
        )}

        {/* Property Type Filters */}
        <div className="mb-10 space-y-4 animate-fade-in">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Our Properties</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {PROPERTY_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover-lift ${selectedType === type
                  ? "bg-primary text-white shadow-lg"
                  : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="animate-fade-in">
          {filteredproperties.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-border">
              <div className="text-5xl mb-4">🏠</div>
              <p className="text-muted-foreground text-lg font-medium">No properties found in this category.</p>
            </div>
          ) : (
            <div className="-mx-8 grid gap-6 sm:mx-0 sm:grid-cols-2 lg:grid-cols-3">
              {filteredproperties.map((product, idx) => (
                <div
                  key={product.id}
                  className="relative group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ProductCard product={product} />

                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2.5 rounded-lg bg-white shadow-lg hover:bg-primary hover:text-white transition-all hover-lift"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2.5 rounded-lg bg-white shadow-lg hover:bg-destructive hover:text-white transition-all hover-lift"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Your Plot — blinking CTA */}
        <PlotBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} qrCodes={qrCodes} />
        <div className="mt-14 mb-4 flex justify-center">
          <button
            onClick={() => setBookingOpen(true)}
            className="relative px-8 py-4 rounded-2xl text-white text-base font-bold shadow-lg overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
          >
            <span
              className="absolute inset-0 rounded-2xl"
              style={{
                animation: "pulse-ring 1.6s ease-out infinite",
                background: "hsl(152,55%,32%)",
                opacity: 0,
              }}
            />
            🏡 Book Your Plot Now
          </button>
        </div>

        {/* Modal form */}
        {isAdmin && (
          <Modal
            open={isModalOpen}
            onClose={() => {
              setEditingProduct(null);
              setIsCreating(false);
            }}
          >
            <ProductForm
              initialData={editingProduct}
              onCancel={() => {
                setEditingProduct(null);
                setIsCreating(false);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Index;
