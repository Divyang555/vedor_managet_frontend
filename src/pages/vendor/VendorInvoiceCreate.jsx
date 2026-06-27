import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VendorLayout from "../../components/vendor_layout/VendorLayout";
import vendorPurchaseOrderService from "../../services/vendorPurchaseOrderService";
import vendorInvoiceService from "../../services/vendorInvoiceService";
import { toast } from "react-toastify"; 

const VendorInvoiceCreate = () => {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  // Framework Structural States
  const [poDetails, setPoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Editable Form Payload Bucket
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    amount: "",
    remarks: ""
  });

  // Lifecycle load effect to fetch target PO specifications on mount
  useEffect(() => {
    const fetchPODetails = async () => {
      try {
        setLoading(true);
        const data = await vendorPurchaseOrderService.getPurchaseOrderById(purchaseOrderId);
        setPoDetails(data);
        
        if (data) {
          setFormData((prev) => ({ ...prev, amount: data.grandTotal || data.amount || "" }));
        }
      } catch (err) {
        console.error("Framework failure looking up PO records:", err);
        toast.error("Purchase Order not found or disconnected from API data line.");
      } finally {
        setLoading(false);
      }
    };

    if (purchaseOrderId) fetchPODetails();
  }, [purchaseOrderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Drag & Drop local file intercept handler
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.warning("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5 MB validation
      toast.warning("Maximum file size is 5 MB");
      return;
    }
    setSelectedFile(file);
    toast.info(`Attached: ${file.name}`);
  };

  // Business rules dynamic evaluation matching amount constraints
  const poGrandTotal = poDetails ? (poDetails.grandTotal || poDetails.amount || 0) : 0;
  const inputAmount = Number(formData.amount || 0);
  const isAmountInvalid = inputAmount > poGrandTotal;

  // Core Form Submission pipeline logic execution
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.invoiceNumber || !formData.invoiceDate || !formData.dueDate || !formData.amount) {
      toast.warning("Please complete all required fields annotated with a red asterisk.");
      return;
    }

    if (isAmountInvalid) {
      toast.error("Invoice Amount cannot exceed Purchase Order Amount.");
      return;
    }

    // 🚀 FIXED: Strict Invoice PDF file tracking requirement check
    if (!selectedFile) {
      toast.error("Invoice PDF file is required.");
      return;
    }

    try {
      setSubmitting(true);
      
      // 🚀 FIXED: Generating Standard multipart FormData context payload structure
      const submissionData = new FormData();
      submissionData.append("purchaseOrderId", Number(purchaseOrderId));
      submissionData.append("invoiceNumber", formData.invoiceNumber);
      submissionData.append("invoiceDate", formData.invoiceDate);
      submissionData.append("dueDate", formData.dueDate);
      submissionData.append("amount", Number(formData.amount));
      submissionData.append("remarks", formData.remarks || "");
      submissionData.append("invoiceFile", selectedFile); // Attaching binary blob context securely

      await vendorInvoiceService.createInvoice(submissionData);
      
      toast.success("Invoice submitted successfully.");
      navigate("/vendor/purchase-orders/list");
    } catch (err) {
      console.error("Remittance generation operation failed:", err);
      // Processing standard structural multi-tier server message tracking
      const serverMessage = err.response?.data?.message || err.response?.data || "Unable to dispatch invoice submission data sheets.";
      toast.error(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout pageTitle="Loading Record Segments...">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "350px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading system telemetry...</span>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout pageTitle="Create Invoice" pageSubtitle="Create a new invoice for the selected purchase order">
      
      <div className="text-start mb-3">
        <button 
          type="button"
          className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1 text-secondary fw-semibold" 
          onClick={() => navigate("/vendor/purchase-orders/list")}
          style={{ fontSize: "13px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Back to Purchase Orders
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="text-start mx-auto w-100" style={{ fontSize: "13px" }}>
        
        {/* ==================== BLOCK 1: READ ONLY PO SPECIFICATIONS CARD ==================== */}
        <div className="card shadow-sm border border-light-subtle rounded-3 mb-4 bg-white">
          <div className="p-3 bg-light border-bottom text-primary fw-bold small d-flex align-items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>info</span>
            Purchase Order Information
          </div>
          <div className="card-body p-4 bg-light-subtle">
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">PO Number</label>
                <input type="text" className="form-control py-2 bg-light text-secondary font-monospace fw-semibold" value={poDetails?.poNumber || "—"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Order Date</label>
                <input type="text" className="form-control py-2 bg-light text-secondary" value={poDetails?.orderDate || "—"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Expected Delivery</label>
                <input type="text" className="form-control py-2 bg-light text-secondary" value={poDetails?.expectedDeliveryDate || "—"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Employee</label>
                <input type="text" className="form-control py-2 bg-light text-secondary" value={poDetails?.employeeName || "—"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Total Amount (₹)</label>
                <input type="text" className="form-control py-2 bg-light text-dark fw-bold font-monospace" value={poGrandTotal ? parseFloat(poGrandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Delivery Address</label>
                <input type="text" className="form-control py-2 bg-light text-secondary" value={poDetails?.deliveryAddress || "—"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Payment Terms</label>
                <input type="text" className="form-control py-2 bg-light text-secondary font-monospace" value={poDetails?.paymentTerms || "—"} readOnly style={{ cursor: "not-allowed", fontSize: "13px" }} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Status</label>
                <div>
                  <span className="badge px-3 py-2 bg-success-subtle text-success border border-success-subtle fw-bold rounded-2" style={{ fontSize: "11px" }}>
                    {poDetails?.status || "APPROVED"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-muted mt-3 small" style={{ fontSize: "11px" }}>
              * Purchase order details are auto-filled and cannot be changed.
            </div>
          </div>
        </div>

        {/* ==================== BLOCK 2: EDITABLE INVOICE TRANSACTION CONTROLS ==================== */}
        <div className="card shadow-sm border border-light-subtle rounded-3 mb-4 bg-white">
          <div className="p-3 bg-light border-bottom text-dark fw-bold small d-flex align-items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>description</span>
            Invoice Details
          </div>
          <div className="card-body p-4">
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label text-secondary small fw-medium mb-1">Invoice Number *</label>
                <input type="text" className="form-control py-2 font-monospace text-dark fw-medium" name="invoiceNumber" placeholder="Enter invoice number" value={formData.invoiceNumber} onChange={handleInputChange} required style={{ fontSize: "13px" }} />
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary small fw-medium mb-1">Invoice Date *</label>
                <input type="date" className="form-control py-2 text-dark font-monospace" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange} required style={{ fontSize: "13px" }} />
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary small fw-medium mb-1">Due Date *</label>
                <input type="date" className="form-control py-2 text-dark font-monospace" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required style={{ fontSize: "13px" }} />
              </div>
            </div>

            <div className="row g-3 mb-2">
              <div className="col-md-4">
                <label className="form-label text-secondary small fw-medium mb-1">Invoice Amount (₹) *</label>
                <input type="number" className={`form-control py-2 font-monospace fw-bold ${isAmountInvalid ? "is-invalid" : "text-dark"}`} name="amount" placeholder="Enter invoice amount" value={formData.amount} onChange={handleInputChange} required style={{ fontSize: "13px" }} />
                {isAmountInvalid && (
                  <div className="invalid-feedback fw-semibold" style={{ fontSize: "11px" }}>
                    Invoice Amount cannot exceed Purchase Order Amount.
                  </div>
                )}
              </div>
              <div className="col-md-8">
                <label className="form-label text-secondary small fw-medium mb-1">Remarks</label>
                <input type="text" className="form-control py-2 text-dark" name="remarks" placeholder="Enter any remarks (optional)" value={formData.remarks} onChange={handleInputChange} style={{ fontSize: "13px" }} />
              </div>
            </div>
            
            <div className="alert alert-warning py-2 px-3 border border-warning-subtle text-warning-emphasis bg-warning-subtle rounded-2 mt-3 small d-flex align-items-center gap-1.5" style={{ fontSize: "12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>warning</span>
              Invoice amount cannot be greater than PO total amount (₹{parseFloat(poGrandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })})
            </div>
          </div>
        </div>

        {/* ==================== BLOCK 3: DRAG AND DROP FILE UPLOAD WRAPPER ==================== */}
        <div className="card shadow-sm border border-light-subtle rounded-3 mb-4 bg-white">
          <div className="p-3 bg-light border-bottom text-dark fw-bold small d-flex align-items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>upload_file</span>
            Upload Invoice (Required) *
          </div>
          <div className="card-body p-4">
            <label className="form-label text-secondary small fw-medium mb-1">Invoice File (PDF only)</label>
            <div 
              className="border border-dashed p-4 rounded-3 text-center bg-light-subtle position-relative"
              style={{ borderStyle: "dashed", borderColor: "#cbd5e1", cursor: "pointer", transition: "all 0.2s" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("hiddenFileInput").click()}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <input type="file" id="hiddenFileInput" accept="application/pdf" className="d-none" onChange={handleFileSelect} />
              <div className="text-secondary d-flex flex-column align-items-center justify-content-center gap-2 py-2">
                <span className="material-symbols-outlined text-muted" style={{ fontSize: "40px" }}>cloud_upload</span>
                <span style={{ fontSize: "13px" }}>Drag &amp; drop your invoice file here, or <span className="text-primary fw-semibold">click to browse</span></span>
                <span className="text-muted" style={{ fontSize: "11px" }}>Only PDF files are allowed. Max size: 5MB</span>
              </div>
            </div>

            {/* 🚀 FIXED: Clear layout tracking panel displaying the name & custom remove option */}
            {selectedFile && (
              <div className="mt-3 p-2 bg-success-subtle text-success border border-success-subtle rounded-3 d-flex align-items-center justify-content-between px-3">
                <div className="d-flex align-items-center gap-2 fw-medium">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>picture_as_pdf</span>
                  <span>{selectedFile.name} <span className="text-muted font-monospace small">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span></span>
                </div>
                {/* Remove file cross trigger action */}
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  title="Remove File"
                ></button>
              </div>
            )}
          </div>
        </div>

        {/* TOOLBAR CONTROLS FOOTER */}
        <div className="d-flex justify-content-end align-items-center gap-2 border-top pt-4 mb-4">
          <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate("/vendor/purchase-orders/list")} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#ffffff" }}>Cancel</button>
          
          {/* 🚀 FIXED: Submit button gets cleanly disabled with an internal spinner during processing */}
          <button 
            type="submit" 
            disabled={submitting || isAmountInvalid || !selectedFile} 
            className="btn btn-primary px-4 py-2 text-white d-flex align-items-center gap-2" 
            style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: (submitting || isAmountInvalid || !selectedFile) ? "#94a3b8" : "#2563eb", border: "none" }}
          >
            {submitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            {submitting ? "Submitting Invoice..." : "Submit Invoice"}
          </button>
        </div>

      </form>
    </VendorLayout>
  );
};

export default VendorInvoiceCreate;