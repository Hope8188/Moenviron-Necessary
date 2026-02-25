import React from 'react';

const NotFoundCard: React.FC = () => {
  return (
    <div className="flex relative w-full min-h-screen items-center justify-center bg-white text-[#353a3e] font-sans">
      <div 
        className="relative bg-white p-[24px] rounded-[8px] max-w-[412px] w-full mx-4"
        style={{
          boxShadow: 'rgba(53, 58, 62, 0.06) 0px 1px 10px 0px, rgba(53, 58, 62, 0.08) 0px 2px 4px 0px'
        }}
      >
        <h1 className="block text-[22px] font-bold leading-[1.2] mb-0 text-[#353a3e]">
          Page not found
        </h1>
        
        <p className="block text-[16px] leading-[1.5] mt-[8px] mb-[16px] text-[#353a3e]">
          Looks like you’ve followed a broken link or entered a URL that doesn’t
          exist on this site.
        </p>
        
        <hr className="block h-[1px] border-0 bg-[#e9ebed] my-[16px]" />
        
        <p className="block text-[14px] leading-[1.5] mt-[14px] mb-0 text-[#353a3e]">
          If this is your site, and you weren’t expecting a 404 for this path,
          please visit Netlify’s{' '}
          <a 
            href="https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125?utm_source=404page&utm_campaign=community_tracking"
            className="inline font-bold text-[#02807d] underline decoration-[#02807d]"
          >
            “page not found” support guide
          </a>{' '}
          for troubleshooting tips.
        </p>
      </div>
    </div>
  );
};

export default NotFoundCard;