// Keep cookie storage denied until a CMP explicitly supplies Clarity consentv2 signals.
// https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
export const CLARITY_BOOTSTRAP = `
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    c[a]("consentv2",{ad_Storage:"denied",analytics_Storage:"denied"});
    t=l.createElement(r);t.async=true;t.nonce=l.currentScript.nonce;
    t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "yzybyfhjvw");
`;
