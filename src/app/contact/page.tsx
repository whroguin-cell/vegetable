"use client";

import { useState } from "react";
import { Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useReveal } from "@/hooks/use-reveal";
import fieldOita from "@/assets/field-oita.jpg";

const inquiryTypes = ["お問い合わせ", "お見積もり依頼", "取引について", "その他"];

export default function ContactPage() {
  const ref = useReveal<HTMLDivElement>();
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      inquiryType: String(formData.get("inquiryType") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      department: String(formData.get("department") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      fax: String(formData.get("fax") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      emailConfirm: String(formData.get("emailConfirm") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (payload.email !== payload.emailConfirm) {
      setSubmitError("メールアドレスと確認用メールアドレスが一致しません。");
      return;
    }

    try {
      setIsSending(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(result?.error || "送信に失敗しました。");
      }

      form.reset();
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "送信に失敗しました。",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="10"
          en="Contact"
          ja="まずは、"
          accentJa="お気軽に"
          tailJa="どうぞ。"
          description="仕入れのご相談、取扱品目のお問い合わせ、供給体制のご相談など。お客様のご要望に合わせた最適なご提案をいたします。"
          breadcrumb={[{ label: "お問い合わせ" }]}
          backgroundImage={fieldOita.src}
          backgroundAlt="大分の協力農家の畑風景"
        />

        <section ref={ref} className="py-16 md:py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 md:w-72 h-64 wa-shippou opacity-50 pointer-events-none hidden md:block" />
          <div className="blob bg-matcha/15 w-[280px] h-[280px] bottom-20 -left-10 hidden md:block" />

          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4 reveal">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight">
                  お電話でも<br />承ります。
                </h2>

                <a
                  href="tel:048-228-6770"
                  className="group flex items-start gap-3 sm:gap-4 p-5 sm:p-8 border-t-2 border-sun bg-green-600 hover:bg-green-700 text-white transition-smooth mb-4"
                >
                  <Phone className="h-8 w-8 sm:h-10 sm:w-10 mt-1 text-white fill-white shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/90 mb-1">Phone</div>
                    <div className="text-[clamp(1.75rem,8vw,3rem)] font-bold text-white transition-smooth font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif] leading-none whitespace-nowrap">
                      048-228-6770
                    </div>
                    <div className="text-sm sm:text-base text-white/90 mt-2">Mon–Fri · 9:00–18:00</div>
                  </div>
                </a>

                <a
                  href="mailto:info@wh-inc.example"
                  className="group flex items-start gap-3 p-5 border-t-2 border-primary bg-secondary/60 hover:bg-secondary transition-smooth"
                >
                  <Mail className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-1">Email</div>
                    <div className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-smooth break-all">
                      info@wh-inc.example
                    </div>
                  </div>
                </a>

                <div className="mt-8 text-xs text-muted-foreground leading-loose">
                  通常2営業日以内に、担当者よりご連絡いたします。
                  内容によってはお時間をいただく場合がございます。
                </div>
              </div>

              <div className="lg:col-span-8 reveal delay-100">
                {submitted ? (
                  <div className="bg-secondary/60 border-t-2 border-sun p-8 md:p-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                      お問い合わせを受け付けました
                    </h3>
                    <p className="text-foreground/70 leading-loose max-w-lg mx-auto">
                      2営業日以内に担当者よりご連絡いたします。しばらくお待ちください。
                    </p>
                    <Button
                      onClick={() => {
                        setSubmitted(false);
                        setSubmitError(null);
                      }}
                      variant="outline"
                      className="mt-8 rounded-none"
                    >
                      もう一件送信する
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="inquiryType" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                        問合せ項目
                      </Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        defaultValue=""
                        className="mt-2 w-full h-12 px-3 bg-background border border-border focus:border-primary focus:outline-none text-sm"
                      >
                        <option value="" disabled>
                          選択してください
                        </option>
                        {inquiryTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                          会社名・団体名 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          required
                          className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                          部署名
                        </Label>
                        <Input
                          id="department"
                          name="department"
                          className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                          お名前またはご担当者名 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                          TEL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0 font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fax" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                          FAX
                        </Label>
                        <Input
                          id="fax"
                          name="fax"
                          type="tel"
                          className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0 font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                          メールアドレス <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emailConfirm" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                        メールアドレス（確認） <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="emailConfirm"
                        name="emailConfirm"
                        type="email"
                        required
                        className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
                        お問い合わせ内容
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={7}
                        placeholder="お問い合わせ内容をご記入ください。"
                        className="mt-2 rounded-none border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                      />
                    </div>

                    <div className="flex items-start gap-3 text-xs text-foreground/70 leading-loose">
                      <input type="checkbox" required className="mt-0.5" />
                      <span>
                        <a href="/access#privacy" className="text-primary underline link-underline">個人情報保護方針</a>
                        に同意の上、送信します。
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSending}
                      size="lg"
                      className="bg-foreground text-primary-foreground hover:bg-primary rounded-none h-14 px-10 tracking-[0.2em] uppercase text-xs group"
                    >
                      {isSending ? "送信中..." : "送信する"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {submitError && (
                      <p className="text-sm text-destructive leading-relaxed">
                        {submitError}
                      </p>
                    )}

                    <div className="space-y-2 pt-2 text-xs text-muted-foreground leading-loose">
                      <p>お問い合わせの内容すべてには回答できないことがあります。</p>
                      <p>お問い合わせの内容によっては、回答に時間がかかる場合があります。</p>
                      <p>お急ぎの方は、お電話でもご質問などお受けしております。お気軽にお問合せください。</p>
                      <p className="text-foreground font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif]">
                        会社電話番号：048-228-6770
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
