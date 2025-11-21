// components/Header.jsx
import React from 'react';
import { Plus, QrCode } from 'lucide-react';

const Header = () => (
<div className="bg-primary-600 rounded-md text-white px-6 py-8 shadow-md">
                    <div className="flex justify-between items-center max-w-9xl mx-auto">
                        <div className="flex items-center">
                            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
                            <div className='flex justify-between'>
                                <div>
                                    <h1 className="text-3xl font-bold">Sample Collection</h1>
                                    <p className="text-primary-100 mt-1">Track, Collect, And Manage Laboratory Samples</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-primary-600 text-white px-4 py-2 rounded flex items-center gap-2">
                                <Plus size={16} /> New Collection
                            </button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                                <QrCode size={16} /> Bulk Barcode
                            </button>
                        </div>
                    </div>
</div>
);

export default Header;
