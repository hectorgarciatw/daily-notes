import React from 'react';
import Card from './Card';

function Content() {
    return (
        <section className="text-gray-600 body-font md:px-10 lg:px-30 xl:px-40">
            <div className="container px-5 py-24 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="mb-8">
                        <Card />
                    </div>
                    <div className="mb-8">
                        <Card />
                    </div>
                    <div className="mb-8">
                        <Card />
                    </div>
                    <div className="mb-8">
                        <Card />
                    </div>
                    <div className="mb-8">
                        <Card />
                    </div>
                    <div className="mb-8">
                        <Card />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Content;
