import React from "react";
import Card from "./Card";

function Content() {
    return (
        <section className="text-gray-600 body-font md:px-10 lg:px-30 xl:px-40">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </section>
    );
}

export default Content;
