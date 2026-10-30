import React, { useState } from 'react';
import { Sparkles, Image, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { ImageUploadService } from '../services/ImageUploadService';

export default function BookingForm({
  type = 'consultation', // 'consultation' or 'custom_design'
  onSuccess
}) {
  const { submitting, errors, bookConsultation } = useBooking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    description: '',
    preferredType: '925 Silver Jewellery',
    categoryType: 'Rings',
    budget: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadStatusMessage, setUploadStatusMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadProgress(true);
      setUploadStatusMessage(`Uploading ${files.length} design sketch(es)...`);
      
      const newUrls = [];
      let successCount = 0;
      
      for (const file of files) {
        try {
          const uploadResult = await ImageUploadService.uploadImage(file);
          newUrls.push(uploadResult.url);
          successCount++;
        } catch (err) {
          console.error("Image upload failed for:", file.name, err);
        }
      }
      
      if (successCount > 0) {
        setUploadedUrls((prev) => [...prev, ...newUrls]);
        setSelectedFiles((prev) => [...prev, ...files.slice(0, successCount)]);
      }
      
      if (successCount === files.length) {
        setUploadStatusMessage(`✓ All ${files.length} images uploaded successfully!`);
      } else {
        setUploadStatusMessage(`✓ Uploaded ${successCount}/${files.length} images successfully.`);
      }
      setUploadProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadProgress) return;

    const payload = {
      ...formData,
      type,
      imageUrl: uploadedUrls[0] || '',
      imageUrls: uploadedUrls,
      createdDate: new Date().toISOString()
    };

    const isSuccess = await bookConsultation(payload);

    if (isSuccess) {
      if (type === 'custom_design') {
        // Open WhatsApp to send message with design url(s) to Admin
        let text = `*New Custom Design Request*\n\n`;
        text += `*Name:* ${formData.name}\n`;
        text += `*Phone:* ${formData.phone}\n`;
        text += `*Category:* ${formData.categoryType}\n`;
        text += `*Budget:* ${formData.budget}\n`;
        text += `*Details:* ${formData.description}\n\n`;
        
        if (uploadedUrls.length > 0) {
          text += `*Reference Image(s):*\n`;
          uploadedUrls.forEach((url, i) => {
            text += `- Image ${i + 1}: ${url}\n`;
          });
        }
        
        const waUrl = `https://wa.me/919451638680?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
      } else if (type === 'consultation') {
        // Open WhatsApp with appointment booking details
        let text = `*New Appointment Booking Request*\n\n`;
        text += `*Name:* ${formData.name}\n`;
        text += `*Contact:* ${formData.phone}\n`;
        if (formData.email) {
          text += `*Email:* ${formData.email}\n`;
        }
        text += `*Preferred Date:* ${formData.date}\n`;
        text += `*Time Slot:* ${formData.timeSlot}\n`;
        if (formData.description) {
          text += `*Customer Need / Details:* ${formData.description}\n`;
        }
        if (formData.preferredType) {
          text += `*Collection Interest:* ${formData.preferredType}\n`;
        }
        text += `\n_Sent via Manish & Co Website — Book an Appointment_`;

        const waUrl2 = `https://wa.me/919451638680?text=${encodeURIComponent(text)}`;
        window.open(waUrl2, '_blank');
      }

      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        timeSlot: '',
        description: '',
        preferredType: '925 Silver Jewellery',
        categoryType: 'Rings',
        budget: ''
      });
      setSelectedFiles([]);
      setUploadedUrls([]);
      setUploadStatusMessage('');
    }
  };

  if (formSuccess) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-[#C8A646]/15 flex items-center justify-center mx-auto mb-3 text-[#C8A646]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="serif-luxury text-lg font-bold text-gold">Request Submitted Successfully</h4>
        <p className="text-xs text-zinc-500 mt-2">Our showroom representatives will reach out to you via WhatsApp shortly.</p>
        <button
          onClick={() => setFormSuccess(false)}
          className="mt-6 px-5 py-2 bg-gradient-to-r from-[#6B4B2E] to-[#B09A82] text-white text-[10px] uppercase font-bold tracking-widest rounded-lg border-none cursor-pointer"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs font-semibold text-[#0D2B4E]">
      {errors.global && (
        <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 p-2.5 rounded-xl">
          {errors.global}
        </p>
      )}

      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Anil Soni"
          className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
          required
        />
        {errors.name && <p className="text-red-500 text-[9px] font-bold">{errors.name}</p>}
      </div>

      {/* WhatsApp Number */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">WhatsApp / Contact Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="e.g. +91 97838 43978"
          className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
          required
        />
        {errors.phone && <p className="text-red-500 text-[9px] font-bold">{errors.phone}</p>}
      </div>

      {/* Email Address */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Email Address (Optional)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="e.g. yourname@gmail.com"
          className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
        />
      </div>

      {type === 'consultation' ? (
        <>
          {/* Customer Need / Description */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Your Need / Requirement</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Tell us what you're looking for (e.g., custom bridal set, ring sizing, kada design, pooja items)..."
              className="w-full p-3 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none resize-none font-sans"
              required
            />
          </div>

          {/* Preferred Date */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Preferred Appointment Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
              required
            />
            {errors.date && <p className="text-red-500 text-[9px] font-bold">{errors.date}</p>}
          </div>

          {/* Time Slot */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Preferred Time Slot</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none bg-white"
              required
            >
              <option value="">Select a preferred hour slot</option>
              <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
              <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              <option value="06:30 PM - 08:30 PM">06:30 PM - 08:30 PM</option>
            </select>
            {errors.timeSlot && <p className="text-red-500 text-[9px] font-bold">{errors.timeSlot}</p>}
          </div>

          {/* Preferred Categories */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Preferred Collection</label>
            <select
              name="preferredType"
              value={formData.preferredType}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none bg-white"
            >
              <option value="925 Silver Jewellery">925 Silver Fine Jewellery</option>
              <option value="Bridal & Payals">Bridal &amp; Payals</option>
              <option value="Men's Collection">Men's Collection (Kada &amp; Chains)</option>
              <option value="Kid's Collection">Kid's Collection (Nazariya &amp; Kits)</option>
              <option value="Couple Sets">Couple Sets &amp; Secret Sets</option>
              <option value="Silver Coins & Bullion">Silver Coins &amp; Bullion</option>
            </select>
          </div>
        </>
      ) : (
        <>
          {/* Category Type */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Category Type</label>
            <select
              name="categoryType"
              value={formData.categoryType}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none bg-white"
              required
            >
              <option value="Rings">Rings</option>
              <option value="Earrings">Earrings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Bangles">Bangles</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Mangalsutras">Mangalsutras</option>
              <option value="Coins">Gold/Silver Coins</option>
              <option value="Other">Other Custom Ornaments</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Target Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="e.g. ₹50,000 or 1.5 Lakhs"
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
              required
            />
          </div>

          {/* Design Description */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Bespoke Ornaments Details</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe details: rings size, gold weight preferences, gemstone colorings..."
              className="w-full p-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none resize-none font-sans"
              required
            />
          </div>

          {/* Reference sketch file upload */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Design sketch(es) or reference image(s)</label>
            <div className="relative border-2 border-dashed border-zinc-200 hover:border-gold rounded-xl p-4 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Image className="w-6 h-6 mx-auto mb-1 text-zinc-400" />
              <span className="text-[10px] text-zinc-400 block">
                {selectedFiles.length > 0 ? `Selected ${selectedFiles.length} file(s)` : 'Choose image file(s) or drag here'}
              </span>
            </div>
            {uploadStatusMessage && (
              <p className={`text-[10px] font-bold mt-1.5 ${
                uploadStatusMessage.startsWith('✓')
                  ? 'text-emerald-600'
                  : uploadStatusMessage.startsWith('❌')
                  ? 'text-red-500'
                  : 'text-amber-500 animate-pulse'
              }`}>
                {uploadStatusMessage}
              </p>
            )}
            
            {/* Gallery Previews of uploaded images */}
            {uploadedUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2.5">
                {uploadedUrls.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-solid border-zinc-100 group bg-zinc-50 flex items-center justify-center shadow-sm">
                    <img src={url} alt={`Sketch ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedUrls(prev => prev.filter((_, i) => i !== idx));
                        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute inset-0 bg-red-600/80 text-white font-extrabold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-none cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || uploadProgress}
        className="w-full py-3.5 bg-gradient-to-r from-[#6B4B2E] to-[#B09A82] text-white text-xs uppercase font-bold tracking-widest rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 cursor-pointer border-none font-bold flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.037L2 22l5.135-1.348a9.954 9.954 0 004.878 1.28c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.037-5.18-2.925-7.07C17.186 3.037 14.678 2 12.012 2zm5.727 14.153c-.313.882-1.554 1.61-2.148 1.666-.59.055-1.18.326-3.766-.694-2.585-1.02-4.237-3.663-4.364-3.834-.127-.171-1.03-1.374-1.03-2.623 0-1.25.654-1.862.887-2.102.233-.24.509-.3.678-.3.17 0 .34 0 .487.007.155.007.363-.058.567.442.204.5.7 1.713.76 1.838.06.126.1.272.017.438-.083.166-.124.272-.25.418-.125.146-.263.327-.375.44-.124.125-.253.26-.11.507.144.247.64 1.056 1.373 1.71.942.843 1.737 1.103 1.983 1.226.246.123.39.103.535-.062.145-.165.62-.72.787-.966.166-.247.33-.206.555-.124.225.083 1.427.674 1.674.8.247.124.412.185.472.289.06.103.06.6-.253 1.482z" />
        </svg>
        <span>
          {submitting || uploadProgress
            ? 'Submitting...'
            : type === 'custom_design'
            ? 'Send Custom Design on WhatsApp'
            : 'Book Appointment on WhatsApp'}
        </span>
      </button>
    </form>
  );
}
