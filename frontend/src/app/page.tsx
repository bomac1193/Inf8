"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section - Full viewport, vertically centered */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center px-6 md:px-16">
        <div className="max-w-[640px] text-center">
          {/* Wordmark */}
          <h1
            className="text-[56px] md:text-[72px] font-normal text-[#F5F3F0] tracking-tight mb-8"
            style={{ fontFamily: "'Söhne', var(--font-space-grotesk), sans-serif" }}
          >
            ∞8
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-[#8A8A8A] mb-8">
            ARCH
          </p>

          {/* Product Name */}
          <p className="text-base uppercase tracking-widest text-[#8A8A8A] mb-6">
            Declarations v1.0
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-[#F5F3F0] font-medium leading-relaxed mb-6">
            The professional standard for documenting how music gets made in the AI era.
          </p>

          <p className="text-base text-[#8A8A8A] leading-relaxed mb-16">
            Prove your process. Machine-readable declarations.
            Verifiable creative lineage. Free to use.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/new"
              className="px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100"
            >
              Create Declaration
            </Link>
            <Link
              href="/gallery"
              className="px-6 py-3 border border-[#2A2A2A] text-[#F5F3F0] font-medium text-sm tracking-wide hover:border-[#8A8A8A] transition-colors duration-100"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* What it is Section */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            What ∞8 ARCH Does
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Identity
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Cryptographically verifiable artist identity. Collaborators with
                revenue splits. Contributors with roles.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Creative Stack
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Document every tool in your workflow. DAWs, plugins, AI models,
                hardware. The full picture.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Production Intelligence
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Quantified AI contribution by phase. Composition, arrangement,
                production, mixing, mastering. Methodology notes.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Provenance Chain
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                IPFS CID links to source material, samples, stems. Immutable
                revision history. Audio fingerprint verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            Get Started in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="text-3xl font-medium text-[#F5F3F0] mb-4">1</div>
              <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-3">
                Create or Import
              </p>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Start from scratch or use our Suno/Udio bookmarklets to auto-fill track data. Takes 10 seconds.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="text-3xl font-medium text-[#F5F3F0] mb-4">2</div>
              <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-3">
                Document Process
              </p>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Add tools, AI percentages, collaborators, and methodology. Be as detailed or minimal as you want.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="text-3xl font-medium text-[#F5F3F0] mb-4">3</div>
              <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-3">
                Save & Share
              </p>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Get a unique URL for your declaration. Share it, embed it, or mint it on-chain later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Platform Integrations */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-6">
            Platform Integrations
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-8">
            Created a track with Suno or Udio? Document it in 10 seconds with our one-click bookmarklets. Each bookmarklet extracts track metadata and pre-fills your declaration form.
          </p>

          {/* Bookmarklet Buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Suno Bookmarklet */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                Suno
              </p>
              <p className="text-sm text-[#8A8A8A] mb-4">
                Extracts title, prompt, model version, and artist from suno.com track pages.
              </p>
              <button
                onClick={() => {
                  const bookmarkletCode = `javascript:(function(){if(!window.location.hostname.includes('suno')){alert('Please run this bookmarklet while on suno.com');return;}let title='';let prompt='';let lyrics='';let artist='';let model='Suno';const titleEls=document.querySelectorAll('h1,[class*="title"],[class*="Title"],[class*="song"]');for(const el of titleEls){const text=el.textContent.trim();if(text&&text.length<100&&!text.includes('Suno')&&!text.includes('Create')){title=text;break;}}if(!title){const dt=document.title;if(dt&&!dt.toLowerCase().startsWith('suno')){title=dt.replace(/\\s*[\\|\\u2013\\u2014-]\\s*Suno.*$/i,'').trim();}}const textareas=document.querySelectorAll('textarea');for(const ta of textareas){const text=ta.value||ta.textContent||'';const ph=ta.placeholder||'';if(ph.toLowerCase().includes('descri')||ph.toLowerCase().includes('prompt')){if(text){prompt=text;}}else if(text.length>50){lyrics=text;}}if(!prompt&&lyrics){const fl=lyrics.split('\\n').find(function(l){return l.trim().length>0;});if(fl){prompt='Song with lyrics: '+fl.substring(0,100)+'...';}}const spans=document.querySelectorAll('button,a,span,div');for(const el of spans){const text=el.textContent?.trim()||'';if(text.includes('@')&&text.length<30){artist=text.replace('@','').trim();break;}}let vm=document.body.textContent.match(/v[0-9.]+/i);if(vm){let vs=vm[0].trim();if(!vs.startsWith('v')){vs='v'+vs;}model='Suno '+vs;}else{model='Suno v4';}if(!title){title='Untitled Track';}if(!prompt){prompt='Generated with Suno AI';}const baseUrl=window.location.hostname.includes('localhost')?'http://localhost:3000/new':'https://inf8.vercel.app/new';const params=new URLSearchParams({title:title,aiPrompt:prompt,methodology:'AI-generated track with '+model+'. Review and describe your actual process.',model:model,artist:artist||'Your Name',aiModels:model,daws:'N/A',plugins:'N/A',hardware:'N/A',aiComp:'100',aiArr:'100',aiProd:'100',aiMix:'100',aiMaster:'100'});window.open(baseUrl+'?'+params.toString(),'_blank');alert('Opening declaration form with Suno data!');})();`;
                  navigator.clipboard.writeText(bookmarkletCode);
                  alert('Suno bookmarklet code copied! Create a bookmark and paste this as the URL.');
                }}
                className="px-5 py-3 bg-[#0A0A0A] border border-[#8A8A8A] text-[#F5F3F0] text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-100 w-full"
              >
                Copy Suno Bookmarklet
              </button>
            </div>

            {/* Udio Bookmarklet */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                Udio
              </p>
              <p className="text-sm text-[#8A8A8A] mb-4">
                Extracts title, prompt, tags, lyrics, model version, and creator from udio.com track pages.
              </p>
              <button
                onClick={() => {
                  const bookmarkletCode = `javascript:(function(){if(!window.location.hostname.includes('udio')){alert('Please run this bookmarklet while on udio.com');return;}let title='';let prompt='';let lyrics='';let tags='';let artist='';let model='';let duration='';const h1s=document.querySelectorAll('h1');for(const el of h1s){const t=el.textContent.trim();if(t&&t.length>0&&t.length<120&&!t.toLowerCase().includes('udio')&&!t.toLowerCase().includes('create')&&!t.toLowerCase().includes('sign')){title=t;break;}}if(!title){const sels=['[class*="songTitle"]','[class*="SongTitle"]','[class*="trackTitle"]','[class*="TrackTitle"]','h2'];for(const s of sels){const el=document.querySelector(s);if(el&&el.textContent.trim()&&el.textContent.trim().length<120){title=el.textContent.trim();break;}}}if(!title){const dt=document.title;if(dt&&!dt.toLowerCase().startsWith('udio')){title=dt.replace(/\\s*[\\|\\u2013\\u2014-]\\s*Udio.*$/i,'').trim();}}const allEls=document.querySelectorAll('*');for(const el of allEls){if(el.children.length===0&&el.textContent.trim()==='Prompt'){const p=el.parentElement;if(p){const sibs=p.querySelectorAll('*');for(const sib of sibs){const st=sib.textContent.trim();if(st&&st!=='Prompt'&&st.length>5&&st.length<1000){prompt=st;break;}}if(!prompt&&p.nextElementSibling){const nt=p.nextElementSibling.textContent.trim();if(nt&&nt.length>5){prompt=nt;}}}if(prompt)break;}}if(!prompt){const ps=['[class*="prompt"]','[class*="Prompt"]','[class*="description"]'];for(const s of ps){const els=document.querySelectorAll(s);for(const el of els){const t=(el.value||el.textContent||'').trim();if(t&&t.length>5&&t.length<1000&&t!=='Prompt'){prompt=t;break;}}if(prompt)break;}}const tagLinks=document.querySelectorAll('a[href*="/tags/"]');const tagSet=new Set();for(const link of tagLinks){const t=link.textContent.trim();if(t&&t.length<50){tagSet.add(t);}}tags=Array.from(tagSet).join(', ');for(const el of allEls){if(el.children.length===0&&el.textContent.trim()==='Lyrics'){const p=el.parentElement;if(p){const sibs=p.querySelectorAll('*');for(const sib of sibs){const st=sib.textContent.trim();if(st&&st!=='Lyrics'&&st.length>20){lyrics=st;break;}}if(!lyrics&&p.nextElementSibling){const nt=p.nextElementSibling.textContent.trim();if(nt&&nt.length>20){lyrics=nt;}}}if(lyrics)break;}}const creatorLinks=document.querySelectorAll('a[href*="/creators/"]');for(const link of creatorLinks){const t=link.textContent.trim();if(t&&t.length<50&&t.length>0){artist=t.replace('@','').trim();break;}}if(!artist){const spans=document.querySelectorAll('span,a,div,p');for(const el of spans){const t=el.textContent.trim();if(t.startsWith('@')&&t.length<30&&t.length>1){artist=t.replace('@','').trim();break;}}}const pt=document.body.textContent||'';if(/v1\\.5\\s*Allegro/i.test(pt)){model='Udio v1.5 Allegro';}else if(/v1\\.5/i.test(pt)){model='Udio v1.5';}else if(/v1\\.0/i.test(pt)||/\\bv1\\b/i.test(pt)){model='Udio v1';}else{model='Udio v1.5';}if(!title){title='Untitled Track';}if(!prompt&&lyrics){const fl=lyrics.split('\\n').find(function(l){return l.trim().length>0;});if(fl){prompt='Song with lyrics: '+fl.substring(0,100)+'...';}}if(!prompt&&tags){prompt='AI-generated track. Tags: '+tags;}if(!prompt){prompt='Generated with Udio AI';}let methodology='AI-generated track with '+model+'.';if(tags){methodology+=' Tags: '+tags+'.';}methodology+=' Review and describe your actual process.';const baseUrl=window.location.hostname.includes('localhost')?'http://localhost:3000/new':'https://inf8.vercel.app/new';const params=new URLSearchParams({title:title,aiPrompt:prompt,methodology:methodology,model:model,artist:artist||'Your Name',aiModels:model,daws:'N/A',plugins:'N/A',hardware:'N/A',aiComp:'100',aiArr:'100',aiProd:'100',aiMix:'100',aiMaster:'100'});window.open(baseUrl+'?'+params.toString(),'_blank');alert('Opening declaration form with Udio data!');})();`;
                  navigator.clipboard.writeText(bookmarkletCode);
                  alert('Udio bookmarklet code copied! Create a bookmark and paste this as the URL.');
                }}
                className="px-5 py-3 bg-[#0A0A0A] border border-[#8A8A8A] text-[#F5F3F0] text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-100 w-full"
              >
                Copy Udio Bookmarklet
              </button>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-[#F5F3F0] font-medium mb-4">
                One-Time Setup
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">1</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Copy the bookmarklet code for your platform (Suno or Udio)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">2</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Right-click your bookmarks bar &rarr; &ldquo;Add page&rdquo; or &ldquo;Add bookmark&rdquo;
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">3</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Name it (e.g. &ldquo;&#8734;8 + Suno&rdquo; or &ldquo;&#8734;8 + Udio&rdquo;) &rarr; Paste the code as the URL &rarr; Save
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#F5F3F0] font-medium mb-4">
                Daily Usage
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">1</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Go to suno.com or udio.com and open a track page
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">2</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Click the bookmarklet in your bookmarks bar
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#F5F3F0] font-mono text-xs shrink-0 bg-[#2A2A2A] px-2 py-1">3</span>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed">
                    Declaration form opens pre-filled &rarr; Review details &rarr; Save
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Extraction details */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A]">
              <p className="text-xs text-[#8A8A8A]">
                <span className="text-[#F5F3F0]">Suno:</span> Extracts track title, prompt, model version (v3.5, v4), and artist name from any Suno track page.
              </p>
            </div>
            <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A]">
              <p className="text-xs text-[#8A8A8A]">
                <span className="text-[#F5F3F0]">Udio:</span> Extracts track title, prompt, tags, lyrics, model version (v1, v1.5, v1.5 Allegro), and creator name from any Udio track page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Declaration Preview */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            Declaration Structure
          </h2>

          <div className="bg-[#0D0D0D] border border-[#2A2A2A] p-6 md:p-8 overflow-x-auto">
            <pre
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'Söhne Mono', var(--font-plex-mono), monospace" }}
            >
              <code>
                <span className="text-[#F5F3F0]">{"{"}</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  version</span>
                <span className="text-[#F5F3F0]">: </span>
                <span className="text-[#B8A586]">&quot;1.0&quot;</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  declaration_id</span>
                <span className="text-[#F5F3F0]">: </span>
                <span className="text-[#B8A586]">
                  &quot;∞8-Qm...&quot;
                </span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  identity</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">primary_artist, collaborators, contributors</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  creative_stack</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">daws, plugins, ai_models, hardware</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  production_intelligence</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">ai_contribution, methodology</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  provenance</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">ipfs_cid, source_material, stems</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                <span className="text-[#F5F3F0]">,</span>
                {"\n"}
                <span className="text-[#8A8A8A]">  audio_fingerprint</span>
                <span className="text-[#F5F3F0]">: {"{"} </span>
                <span className="text-[#8A8A8A]">sha256, duration_ms, format</span>
                <span className="text-[#F5F3F0]"> {"}"}</span>
                {"\n"}
                <span className="text-[#F5F3F0]">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Do I need a crypto wallet to use ∞8 ARCH?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                No. You can create declarations anonymously during beta. Connecting a wallet enables on-chain minting, revenue splits via smart contracts, and permanent provenance records. But basic documentation works without one.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                What happens to my data?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Declarations are stored in our database and can be viewed publicly in the gallery. Audio files are stored on IPFS (Pinata). Anonymous declarations can be deleted during beta. Wallet-connected and minted declarations become permanent for provenance integrity.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                How is the transparency score calculated?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                It's based on declaration completeness: how many fields you fill, whether you've uploaded audio, documented your creative stack, added collaborators, etc. Higher scores indicate more thorough documentation, not "better" music.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Can I document non-AI music?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Absolutely. Set all AI contribution percentages to 0% and document your traditional workflow. The protocol works for any creative process—AI-native, hybrid, or fully human.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                What does "minting" mean and why would I do it?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Minting creates an NFT of your declaration on the blockchain, making it permanently immutable. Benefits: cryptographic proof of creation date, integration with ISSUANCE platform for revenue streams, ability to track lineage and derivatives, and enforcing smart contract splits for collaborators.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Is this just for Suno and Udio? What about other AI music tools?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                We have dedicated bookmarklets for Suno and Udio, but you can manually create declarations for any tool: Stable Audio, AIVA, or even traditional DAWs. The protocol is tool-agnostic.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                Can I edit declarations after creating them?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Not yet. Once created, declarations are immutable by design to maintain provenance integrity. If you need to update information, create a new declaration with parentRelation set to "remix" or "derivative." Edit functionality may be added for pre-minted declarations.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-[#F5F3F0] mb-3">
                What's the difference between collaborators and contributors?
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Collaborators get revenue splits (on-chain enforcement via smart contracts). Contributors get credit but no direct splits (think: session musicians, studio engineers, co-writers). Both are recorded in the declaration for attribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-8">
            Who This Is For
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            <span className="text-[#F5F3F0]">AI-native producers</span> building tracks with Suno, Udio, or custom models — and want a professional record of how they work. Not because anyone asked. Because your process is the proof.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            <span className="text-[#F5F3F0]">Producer-engineers</span> running hybrid workflows — AI stems into Ableton, live vocals over generated arrangements, three collaborators across two continents. Traditional metadata can't capture what you're doing.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            <span className="text-[#F5F3F0]">Anyone who sees transparency as a competitive advantage</span> — not a liability. Your 73% AI composition paired with hand-crafted arrangement isn't something to hide. It's proof you understand your tools at a level most producers never reach.
          </p>
          <p className="text-[#8A8A8A] leading-relaxed mb-16">
            EU AI Act Article 50 requires AI content labeling by August 2026. The infrastructure you'll need doesn't exist yet in the legacy music industry. It exists here.
          </p>

          <h2 className="text-2xl font-medium text-[#F5F3F0] mb-8">
            Not for everyone. That's the point.
          </h2>
          <p className="text-[#8A8A8A] leading-relaxed mb-6">
            If documenting your creative stack feels like exposure rather than demonstration, that's fine — different stages, different needs. The protocol is here when you're ready.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-xl text-[#8A8A8A] mb-8">
            Your process is your proof. Document it.
          </p>
          <Link
            href="/new"
            className="inline-block px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100"
          >
            Create Your First Declaration
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <p className="text-xs text-[#8A8A8A] leading-relaxed mb-4">
            <span className="text-[#F5F3F0] font-medium">Disclaimer:</span> ∞8 ARCH provides infrastructure for creative provenance documentation. Users are solely responsible for the accuracy of their declarations and compliance with applicable laws. We make no warranties regarding the legal enforceability of declarations or rights claimed therein. This service is provided "as-is" without guarantees of any kind.
          </p>
          <p className="text-xs text-[#8A8A8A] leading-relaxed">
            AI model names (Suno, Udio, AIVA, etc.) are trademarks of their respective owners. Mention of these tools is for descriptive purposes only and does not imply endorsement or affiliation. Users should comply with the terms of service of any third-party tools they document in their declarations.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8A8A8A]">
          <div>∞8 ARCH — Open Protocol</div>
          <div className="flex gap-8">
            <Link
              href="/gallery"
              className="hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              Gallery
            </Link>
            <a
              href="https://github.com/bomac1193/Inf8"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
