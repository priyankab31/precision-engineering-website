import { supabase, supabaseConfigured } from "./supabase.js";
const form=document.getElementById("quoteForm");
const status=document.getElementById("quoteStatus");
const show=(m,t="")=>{status.textContent=m;status.className="status-message "+t;};
if(form) form.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!supabaseConfigured) return show("Enquiry form setup is incomplete. Configure Supabase first.","error");
  const file=document.getElementById("drawing").files[0];
  const payload={
    contact_name:document.getElementById("name").value.trim(),
    company_name:document.getElementById("company").value.trim(),
    email:document.getElementById("email").value.trim(),
    phone:document.getElementById("phone").value.trim(),
    service:document.getElementById("service").value,
    quantity:document.getElementById("quantity").value.trim(),
    message:document.getElementById("message").value.trim()
  };
  show("Submitting enquiry...");
  const {data:auth}=await supabase.auth.getUser();
  payload.user_id=auth.user?.id ?? null;
  if(file){
    const allowed=["application/pdf","application/dxf","image/vnd.dxf","application/octet-stream"];
    const ext=file.name.split(".").pop().toLowerCase();
    if(!["pdf","step","stp","dxf"].includes(ext)) return show("Allowed file types: PDF, STEP, STP and DXF.","error");
    if(file.size>10*1024*1024) return show("File size must be 10 MB or less.","error");
    const safeName=`${crypto.randomUUID()}.${ext}`;
    const {error:uploadError}=await supabase.storage.from("customer-drawings").upload(safeName,file,{upsert:false});
    if(uploadError) return show("File upload failed: "+uploadError.message,"error");
    payload.drawing_path=safeName;
  }
  const {error}=await supabase.from("enquiries").insert(payload);
  if(error) return show("Could not submit: "+error.message,"error");
  form.reset(); show("Thank you. Your enquiry has been submitted.","success");
});
