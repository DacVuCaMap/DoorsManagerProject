import React from 'react'

export default function PhukienList() {

    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>Tên vật tư</th>
                    <th>NCC</th>
                    <th>Đơn vị</th>
                    <th>Đơn giá</th>
                    <th>Hệ số chi phí</th>
                    <th>HSCP&lt;10</th>
                    <th>HSCP&lt;20</th>
                    <th>HSCP&lt;30</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>The</td>
                    <td>Malcolm Lockyer</td>
                    <td>1961</td>
                </tr>
                <tr>
                    <td>Wit</td>
                    <td>The Eagles</td>
                    <td>1972</td>
                </tr>
                <tr>
                    <td>Shi</td>
                    <td>Earth, Wind, and Fire</td>
                    <td>1975</td>
                </tr>
            </tbody>
        </table>
    )
}
