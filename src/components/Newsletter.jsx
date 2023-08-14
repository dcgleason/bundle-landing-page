import React, {useEffect} from "react";

const NewsletterContactForm = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src='https://js.hsforms.net/forms/v2.js';
        document.body.appendChild(script);

        script.addEventListener('load', () => {
            // @TS-ignore
            if (window.hbspt) {
                // @TS-ignore
                window.hbspt.forms.create({
                    region: 'na1',
                    portalId: '22464839',
                    formId: '57926969-8049-4e24-9df0-eb22ce6522e1',
                    target: '#newsletterForm'
                })
            }
        });
    }, []);

    return (
        <div>
            <div id="newsletterForm"></div>
        </div>
    );

}

export default NewsletterContactForm;