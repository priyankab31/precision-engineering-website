import { supabase, supabaseConfigured } from "./supabase.js";
const status = document.getElementById("authStatus");
const show = (message, type="") => { if(status){status.textContent=message;status.className="status-message "+type;} };
if (!supabaseConfigured) show("Setup required: add your Supabase URL and publishable key in assets/js/supabase.js.");
const loginForm = document.getElementById("loginForm");
if (loginForm) loginForm.addEventListener("submit", async e => {
  e.preventDefault(); if(!supabaseConfigured) return;
  show("Signing in...");
  const {error} = await supabase.auth.signInWithPassword({
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  });
  if(error) return show(error.message,"error");
  location.href = "dashboard.html";
});
const registerForm = document.getElementById("registerForm");
if (registerForm) registerForm.addEventListener("submit", async e => {
  e.preventDefault(); if(!supabaseConfigured) return;
  show("Creating account...");
  const fullName=document.getElementById("fullName").value.trim();
  const company=document.getElementById("company").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const {data,error}=await supabase.auth.signUp({
    email:document.getElementById("email").value.trim(),
    password:document.getElementById("password").value,
    options:{data:{full_name:fullName,company,phone},emailRedirectTo:location.origin+"/login.html"}
  });
  if(error) return show(error.message,"error");
  show(data.session ? "Account created. You can now sign in." : "Registration received. Check your email to confirm your account.","success");
});
const reset=document.getElementById("resetPassword");
if(reset) reset.addEventListener("click",async e=>{
  e.preventDefault(); if(!supabaseConfigured) return show("Configure Supabase first.");
  const email=document.getElementById("email").value.trim();
  if(!email) return show("Enter your email address first.","error");
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+"/login.html"});
  show(error ? error.message : "If the email is registered, password reset instructions have been sent.",error?"error":"success");
});
