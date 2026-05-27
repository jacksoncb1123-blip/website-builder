#!/usr/bin/env node
/* ============================================================
   Mullein Leaf Extract Drops — Shopify auto-setup
   Creates the product + content pages via the Admin REST API.

   Runs on YOUR machine against YOUR store (this cannot run from a
   sandbox — it needs your store credentials).

   ---- SETUP (one time) ----
   1. In Shopify admin: Settings → Apps and sales channels →
      "Develop apps" → "Create an app" (e.g. "Store Setup").
   2. Configure Admin API scopes:  write_products, write_content
   3. Install the app → reveal the "Admin API access token"
      (starts with shpat_...). Copy it.
   4. Set env vars and run (Node 18+ required; uses global fetch):

        export SHOPIFY_STORE="your-store.myshopify.com"
        export SHOPIFY_ADMIN_TOKEN="shpat_xxxxxxxxxxxxxxxx"
        node setup-store.mjs            # create everything
        node setup-store.mjs --dry-run  # preview without writing

   Everything is created UNPUBLISHED / as a draft so nothing goes
   live until you review. Re-running creates duplicates — delete the
   first set in the admin if you run it twice.
   ============================================================ */

const STORE = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";
const DRY = process.argv.includes("--dry-run");

if (!STORE || !TOKEN) {
  console.error("\n✗ Missing credentials.\n  Set SHOPIFY_STORE and SHOPIFY_ADMIN_TOKEN, e.g.:\n" +
    '    export SHOPIFY_STORE="your-store.myshopify.com"\n' +
    '    export SHOPIFY_ADMIN_TOKEN="shpat_..."\n');
  process.exit(1);
}

async function api(path, method = "GET", body) {
  const url = `https://${STORE}/admin/api/${API_VERSION}/${path}`;
  if (DRY) {
    console.log(`  [dry-run] ${method} ${path}`);
    return { dryRun: true };
  }
  const res = await fetch(url, {
    method,
    headers: { "X-Shopify-Access-Token": TOKEN, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}\n${text}`);
  // Shopify rate limit: be gentle
  await new Promise((r) => setTimeout(r, 600));
  return data;
}

const p = (s) => `<p>${s}</p>`;

const PRODUCT_HTML = [
  p("Mullein Leaf Extract Drops are a simple, plant-based way to support your daily respiratory wellness routine. Made from the leaves of <em>Verbascum thapsus</em> — mullein — a herb with a long history of traditional use, our drops deliver mullein in an easy, alcohol-free liquid form you can add to water, tea, or juice."),
  p("Each batch is crafted in small quantities for freshness and bottled in a 2 fl oz (60 mL) glass bottle with a precision dropper, so you get a consistent amount every time."),
  "<h4>Why you'll love it</h4>",
  "<ul><li>Respiratory wellness support, the traditional way</li><li>Alcohol-free, glycerin-based — smooth, mild taste</li><li>Convenient dropper for easy daily use</li><li>Vegan, non-GMO, gluten-free</li><li>Small-batch crafted and third-party tested for quality</li></ul>",
  "<h4>Suggested use</h4>",
  p("Shake well before use. Add 1 mL (about one full dropper) to a glass of water, tea, or juice, up to twice daily, or as directed by your healthcare provider."),
  "<h4>Ingredients</h4>",
  p("Mullein Leaf Extract (Verbascum thapsus), Vegetable Glycerin, Purified Water."),
  p("This product is not intended for children, or for those who are pregnant or nursing, without first consulting a healthcare provider."),
  p("<em>These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</em>"),
].join("\n");

const PAGES = [
  {
    title: "About",
    body_html: [
      p("Our story starts with a simple belief: wellness should be clean, honest, and rooted in nature."),
      p("We created Mullein Leaf Extract Drops because we wanted a respiratory wellness supplement we'd actually feel good about taking — and giving to the people we love. No long ingredient lists we couldn't pronounce. No alcohol. No filler. Just carefully sourced mullein leaf, captured in a smooth glycerin extract and bottled in small batches for freshness."),
      p("Mullein (Verbascum thapsus) has been part of traditional herbal practice for generations. We pair that time-honored plant with modern quality standards: every batch is third-party tested, and every bottle is made to a recipe we're proud to stand behind."),
      p("We're a small team that cares about doing things the right way — sustainably sourced, transparently made, and always honest about what's inside. Thank you for letting us be part of your wellness routine."),
      p("— The [Your Brand] Team"),
    ].join("\n"),
  },
  {
    title: "Contact",
    body_html: [
      p("We'd love to hear from you. Questions about your order, our ingredients, or wholesale? Send us a message and we'll get back to you within 1–2 business days."),
      p("Email: [support@yourbrand.com]<br>Hours: Monday–Friday, 9AM–5PM"),
    ].join("\n"),
    // To get Dawn's built-in contact form, set this page's template to
    // "page.contact" in the admin (Online Store → Pages → Theme template).
  },
  {
    title: "Shipping Policy",
    body_html: [
      p("Thank you for shopping with us! Here's what to expect after you place an order."),
      "<h4>Order processing</h4>",
      p("Orders are processed within [1–2] business days (Mon–Fri, excluding holidays). You'll receive a confirmation email, then a second email with tracking once it ships."),
      "<h4>Shipping rates &amp; delivery</h4>",
      "<ul><li>Standard (US): $[4.99], or FREE over $[35]. Est. [3–7] business days after processing.</li><li>Expedited (US): $[12.99]. Est. [2–3] business days.</li></ul>",
      p("Delivery times are carrier estimates and are not guaranteed."),
      "<h4>Tracking &amp; issues</h4>",
      p("We'll email a tracking number when your order ships (allow up to 48 hours to update). If your order is delayed, lost, or arrives damaged, contact [support@yourbrand.com] and we'll make it right."),
    ].join("\n"),
  },
  {
    title: "Refund Policy",
    body_html: [
      p("We want you to be happy with your purchase. If you're not, we're here to help."),
      "<h4>30-day satisfaction guarantee</h4>",
      p("You may request a refund within 30 days of delivery. For health and safety reasons, we can only accept returns of unopened, unused items in original packaging — unless the product arrived damaged or defective."),
      "<h4>How to start</h4>",
      p("Email [support@yourbrand.com] with your order number and reason. Please don't send items back before contacting us."),
      "<h4>Refunds</h4>",
      p("Once we receive and inspect your return (or confirm a damaged/defective item), approved refunds go to your original payment method within [5–10] business days. Original shipping is non-refundable unless the return is due to our error."),
    ].join("\n"),
  },
  {
    title: "Privacy Policy",
    body_html: [
      p("Last updated: [DATE]"),
      p("[Your Brand] respects your privacy. This policy explains what we collect, how we use it, and your choices."),
      "<h4>Information we collect</h4>",
      "<ul><li>Information you give us: name, email, address, phone when you order or contact us.</li><li>Payment information: processed securely by our payment provider; we don't store full card numbers.</li><li>Automatic data: device, browser, and usage via cookies/analytics.</li></ul>",
      "<h4>How we use &amp; share it</h4>",
      p("To process and ship orders, provide support, prevent fraud, comply with law, improve the store, and (with consent) send marketing you can unsubscribe from. We share data with service providers (Shopify, payment processors, shipping carriers) and when required by law. We do not sell your personal information."),
      "<h4>Your rights</h4>",
      p("Depending on where you live (GDPR/EU, CCPA/California), you may request access, correction, or deletion, and opt out of marketing. Contact [privacy@yourbrand.com]."),
    ].join("\n"),
  },
  {
    title: "Terms of Service",
    body_html: [
      p("Last updated: [DATE]"),
      p("By using our website and purchasing our products, you agree to these Terms."),
      "<h4>Eligibility &amp; orders</h4>",
      p("You must be at least 18. Product descriptions, availability, and prices may change and may contain errors we may correct. Submitting an order is an offer to purchase, which we may accept or decline."),
      "<h4>Health disclaimer</h4>",
      p("Our products are dietary supplements, not medicine, and nothing here is medical advice. Consult a healthcare provider before use, especially if pregnant, nursing, taking medication, or managing a condition. <em>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</em>"),
      "<h4>Liability &amp; governing law</h4>",
      p("The site and products are provided \"as is\" to the fullest extent permitted by law. These Terms are governed by the laws of the State of [STATE]. Questions? [support@yourbrand.com]."),
    ].join("\n"),
  },
];

async function main() {
  console.log(`\n${DRY ? "DRY RUN — " : ""}Setting up ${STORE} (API ${API_VERSION})\n`);

  console.log("• Creating product: Mullein Leaf Extract Drops ($24.99, draft)");
  const productRes = await api("products.json", "POST", {
    product: {
      title: "Mullein Leaf Extract Drops",
      body_html: PRODUCT_HTML,
      vendor: "[Your Brand]",
      product_type: "Supplement",
      tags: "mullein, respiratory, herbal, wellness, tincture, alcohol-free",
      status: "draft", // stays unpublished until you set it Active
      variants: [{ price: "24.99", inventory_management: null }],
    },
  });
  if (!DRY) console.log(`  ✓ product id ${productRes.product?.id}`);

  console.log("\n• Creating pages (unpublished):");
  for (const page of PAGES) {
    console.log(`  - ${page.title}`);
    const res = await api("pages.json", "POST", {
      page: { title: page.title, body_html: page.body_html, published: false },
    });
    if (!DRY && res.page?.id) console.log(`    ✓ page id ${res.page.id}`);
  }

  console.log("\n✓ Done. Next steps in the admin:");
  console.log("  1. Review the product & pages (all created as draft/unpublished).");
  console.log('  2. Set the Contact page template to "page.contact" for the form.');
  console.log("  3. Add product images, then set the product to Active when ready.");
  console.log("  4. Add the pages to your Main/Footer navigation menus.");
  console.log("  5. (Recommended) Move Shipping/Refund/Privacy/Terms into");
  console.log("     Settings → Policies so they link in the footer automatically.\n");
}

main().catch((err) => {
  console.error("\n✗ Setup failed:\n" + err.message + "\n");
  process.exit(1);
});
