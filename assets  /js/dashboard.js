import { supabase, supabaseConfigured } from "./supabase.js";
const status=document.getElementById("dashboardStatus");
const rows=document.getElementById("enquiryRows");
const emailEl=document.getElementById("profileEmail");
const say=(m,t="")=>{status.textContent=m;status.className="status-message "+t;};
if(!supabaseConfigured) say("Configure Supabase in assets/js/supabase.js before using the portal.","error");
else {
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
    if(!session) location.href="login.html";
  });
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError||!user) location.href="login.html";
  else {
    emailEl.textContent=user.email;
    const {data,error}=await supabase.from("enquiries").select("created_at,service,quantity,status").order("created_at",{ascending:false});
    if(error){say("Could not load enquiries: "+error.message,"error");rows.innerHTML="<tr><td colspan='4'>Unable to load enquiries.</td></tr>";}
    else if(!data.length) rows.innerHTML="<tr><td colspan='4'>No enquiries yet. Use “New enquiry” to get started.</td></tr>";
    else rows.innerHTML=data.map(x=>`<tr><td>${new Date(x.created_at).toLocaleDateString()}</td><td>${escapeHtml(x.service||"—")}</td><td>${escapeHtml(x.quantity||"—")}</td><td>${escapeHtml(x.status||"Received")}</td></tr>`).join("");
  }
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("logoutButton")?.addEventListener("click",async()=>{await supabase.auth.signOut();location.href="login.html";});
