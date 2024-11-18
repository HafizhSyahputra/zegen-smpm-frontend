
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportPDFProps } from "@smpm/models/jobOrderModel";
import { PDFDateIndo, setToEndOfDay } from "@smpm/utils/dateUtils";

const ReportPDF = ({ data }: ReportPDFProps) => {
  const displayValue = (value: string | null | undefined | "" | " " | "undefined" | "null") =>
    value && value.trim() !== "" ? value : "-";

  interface CheckboxProps {
    label: string;
    checked: boolean;
  }

  const Checkbox = ({ label, checked }: CheckboxProps) => (  
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>  
      <Text style={{ color: checked ? 'green' : 'black', marginRight: 5 }}>  
        {checked ? "[X]" : "[ ]"}  
      </Text>  
      <Text>{label}</Text>  
    </View>  
  );
  const formatValue = (value: string) => {  
    const words = value.split(" ");  
    if (words.length <= 5) {  
      return value;  
    } else {  
      let formattedValue = "";  
      for (let i = 0; i < words.length; i += 5) {  
        const chunk = words.slice(i, i + 5);  
        if (i === 0) {  
          formattedValue += chunk[0] + " " + chunk.slice(1).join(" ");  
        } else {  
          formattedValue += "\n\t\t" + chunk.join(" ");  
        }  
      }  
      return formattedValue;  
    }  
  };
  
  return (
    <Document>
    <Page size="A4" style={{ padding: 20, fontSize: 8 }}>
      <Text style={{
        fontSize: 15,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: "#3c8acf",
        padding: 10,
      }}>
        {displayValue(data.job_order_no)} {displayValue(data.job_order.merchant_name)} ({displayValue(data.job_order.mid)})
      </Text>

      {/* Status Approval */}
      {data.status_approve?.toLowerCase() !== "approved" && (  
        <View style={{ marginBottom: 20 }}>  
          <Text style={{  
            fontWeight: "bold",  
            fontSize: 12,  
            marginBottom: 5,  
            textAlign: "center",  
            color: data.status_approve?.toLowerCase() === "rejected" ? "red" : "blue",  
            padding: 10,  
          }}>  
            {data.status_approve?.toLowerCase() === "rejected" ? "Approval Rejected" : "Menunggu Untuk Approval"}  
          </Text>  
          {data.status_approve?.toLowerCase() === "rejected" && (  
            <View>  
              <Text style={{ marginTop: 5,  textAlign: "center", fontWeight: "bold", color: "red"}}>{"Reason   : " + displayValue(data.reason)}</Text>  
              <Text style={{ marginTop: 5,  textAlign: "center", fontWeight: "bold", color: "red"}}>{"Reamark : " + displayValue(data.info_remark)}</Text>  
            </View>  
          )}  
        </View>  
      )}  

      {/* Informasi Penugasan */}  
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>  
        <View style={{ width: "45%", paddingRight: 10 }}>  
          <Text style={{ fontSize: 8, marginBottom: 10, textAlign: "left", fontWeight: "bold", backgroundColor: "#006677", color: "#ffffff", padding: 6 }}>  
            Informasi Penugasan  
          </Text>  
          {[  
            { label: "Target Kedatangan", value: ": " + displayValue(PDFDateIndo(data.job_order.target_date)), color: "red" },  
            {  
              label: "Jatuh Tempo",  
              value: ": " + displayValue(PDFDateIndo(setToEndOfDay(data.job_order.target_date))),  
              color: "red"  
            },  
            { label: "Bank", value: ": " + displayValue(data.job_order.vendor.name), color: "blue" },  
            { label: "No Case/SPK", value: ": " + displayValue(data.job_order_no), color: "black" },  
            { label: "Case Type", value: ": " + displayValue(data.job_order.case_type), color: "black" },  
            { label: "Tipe Pengajuan", value: ": " + displayValue(data.job_order.type), color: "blue" },  
            { label: "Service Point", value: ": " + displayValue(data.job_order.city), color: "black" },  
            { label: "Keterangan", value: ": " + formatValue(displayValue(data.information)), color: "black" },  
          ].map((item, index) => (  
            <View key={index} style={{ flexDirection: "row", marginBottom: 5 }}>  
              <Text style={{ fontWeight: "bold", width: "40%" }}>{item.label}</Text>  
              <Text style={{ width: "60%", color: item.color, maxWidth: "60%", flexWrap: "wrap" }}>{item.value}</Text>  
            </View>  
          ))}  
          {data.job_order.type?.toLowerCase() === 'preventive maintenance' && (  
          <View style={{ flexDirection: "row", marginBottom: 5 }}>  
            <Text style={{ fontWeight: "bold", width: "40%" }}>Tipe PM</Text>  
            <Text style={{ width: "60%", color: "black", maxWidth: "60%", flexWrap: "wrap" }}>  
              {": " + formatValue(displayValue(data.job_order.preventive_type))}  
            </Text>  
          </View>  
        )}  
          {data.status?.toLowerCase() === 'cancel' && (  
          <View style={{ flexDirection: "row", marginBottom: 5 }}>  
            <Text style={{ fontWeight: "bold", width: "40%" }}>Alasan Cancel</Text>  
            <Text style={{ width: "60%", color: "black", maxWidth: "60%", flexWrap: "wrap" }}>  
              {": " + formatValue(displayValue(data.cancel_reason))}  
            </Text>  
          </View>  
        )}  
        </View>  

        {/* Data Merchant */}  
        <View style={{ width: "50%" }}>  
          <View style={{ marginBottom: 10 }}>  
            <Text style={{ fontSize: 8, marginBottom: 10, textAlign: "left", fontWeight: "bold", backgroundColor: "#006677", color: "#ffffff", padding: 6 }}>  
              Data Merchant  
            </Text>  
            {[  
              { label: "Nama", value: ": " + displayValue(data.job_order.merchant_name) },  
              { label: "Alamat penugasan", value: ": " + formatValue(displayValue(data.job_order.merchant.address1 + " " + data.job_order.merchant.address2 + " " + data.job_order.merchant.address3 + " " + data.job_order.merchant.address4)) },  
              { label: "Kota & Kode Pos", value: ": " + formatValue(displayValue(data.job_order.merchant.city + ", " + data.job_order.merchant.postal_code)) },  
              { label: "Provinsi", value: ": " + formatValue(displayValue(data.job_order.merchant.province)) },  
              { label: "Contact Person", value: ": " + formatValue(displayValue(data.job_order.merchant.customer_name)) },  
              { label: "Telepon", value: ": " + formatValue(displayValue(data.job_order.merchant.phone1)) },  
            ].map((item, index) => (  
              <View key={index} style={{ flexDirection: "row", marginBottom: 5 }}>  
                <Text style={{ fontWeight: "bold", width: "50%" }}>{item.label}</Text>  
                <Text style={{ width: "50%", color: item.label === "Nama:" ? "red" : "black", maxWidth: "50%", flexWrap: "wrap" }}>{item.value}</Text>  
              </View>  
            ))}  
          </View>  
        </View>  
      </View>  

      {/* Informasi Terminal */}  
      <View style={{ width: "100%", marginBottom: 5 }}>
        <Text style={{ fontSize: 8, marginBottom: 10, textAlign: "left", fontWeight: "bold", backgroundColor: "#006677", color: "#ffffff", padding: 6 }}>  
          Informasi Terminal  
        </Text>  
        {[  
          { label: "MID", value: ": " + displayValue(data.job_order.merchant.mid) },  
          { label: "TID, TID 2, TID 3", value: ": " + formatValue(displayValue(data.job_order.tid)) },  
          { label: "CSI", value: ": " + displayValue("-") },  
        ].map((item, index) => (  
          <View key={index} style={{ flexDirection: "row", marginBottom: 5 }}>  
            <Text style={{ fontWeight: "bold", width: "50%" }}>{item.label}</Text>  
            <Text style={{ width: "50%", maxWidth: "50%", flexWrap: "wrap" }}>{item.value}</Text>  
          </View>  
        ))}  
      </View>

      {/* Products */}
      <View style={{  
        width: "100%",  
        borderStyle: "solid",  
        borderWidth: 1,  
        borderColor: "#ccc",  
        overflow: "hidden",  
        marginBottom: 10,
      }}>  
        <View style={{  
          flexDirection: "row",  
          backgroundColor: "#006677",  
          fontWeight: "bold",  
        }}>  
          {["Product", "Serial Number", "Notes", "Action"].map((header, index) => (  
            <View key={index} style={{  
              flex: 1,  
              paddingVertical: 10,  
              paddingHorizontal: 15,  
              borderRightWidth: index < 3 ? 1 : 0,  
              borderRightColor: "white",  
            }}>  
              <Text style={{    
                color: "white",  
                fontWeight: "bold",  
                textAlign: "center",  
              }}>{header}</Text>  
            </View>  
          ))}  
        </View>  
        {data.products.map((product, index) => (  
          <View  
            key={index}  
            style={{  
              flexDirection: "row",  
              borderTopWidth: 1,  
              borderTopColor: "#ccc",  
            }}  
          >  
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRightWidth: 1, borderRightColor: "#ccc" }}>  
              <Text style={{ color: "#555" }}>{displayValue(product.name)}</Text>  
            </View>  
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRightWidth: 1, borderRightColor: "#ccc" }}>  
              <Text style={{ color: "#555" }}>{displayValue(product.serial_number)}</Text>  
            </View>  
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRightWidth: 1, borderRightColor: "#ccc" }}>  
              <Text style={{ color: "#555" }}>{formatValue(displayValue(product.notes))}</Text>  
            </View>  
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15 }}>  
              <Text style={{ color: "#555" }}>{formatValue(displayValue(product.action))}</Text>  
            </View>  
          </View>  
        ))}  
      </View>

      {/* Laporan Kerja Teknisi */}
      {data.status_approve?.toLowerCase() === "approved" && (
        <>
          <Text style={{
            fontSize: 10,
            marginBottom: 20,
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#006677",
            color: "#ffffff",
            padding: 6,
          }}>
            Laporan Kerja Teknisi
          </Text>

          <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "50%" }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Status Kunjungan</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Status Approval</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Waktu Kedatangan</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Waktu Mulai</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Line Komunikasi</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>No. Direct Line</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ marginBottom: 5, color: data.status?.toLowerCase() === "done" ? "green" : "black" }}>{": " + displayValue(data.status)}</Text>
                  <Text style={{ marginBottom: 5, color: data.status_approve?.toLowerCase() === "pending" ? "blue" : data.status_approve?.toLowerCase() === "rejected" ? "red" : "green" }}>{": " + displayValue(data.status_approve)}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + displayValue(PDFDateIndo(data.arrival_time))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + displayValue(PDFDateIndo(data.start_time))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + formatValue(displayValue(data.communication_line))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + formatValue(displayValue(data.direct_line_number))}</Text>
                </View>
              </View>
            </View>
            <View style={{ width: "50%" }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Waktu Selesai</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>PIC Merchant</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Phone</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Supply Kertas</Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Indikasi Gesek Tunai</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ marginBottom: 5 }}>{": " + displayValue(PDFDateIndo(data.end_time))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + formatValue(displayValue(data.merchant_pic))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + formatValue(displayValue(data.merchant_pic_phone))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + formatValue(displayValue(data.paper_supply))}</Text>
                  <Text style={{ marginBottom: 5 }}>{": " + formatValue(displayValue(data.swipe_cash_indication))}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            {[
              { title: "Kelengkapan EDC Dongle", items: data.dongle },
              { title: "Material Promo", items: data.promo_materials },
              { title: "Materi Training", items: data.training_materials },
            ].map((section, index) => (
              <View key={index} style={{ width: "30%", paddingRight: 10 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{section.title}</Text>
                <View>
                  {Object.entries(section.items).map(([key, value]) => (
                    <Checkbox key={key} label={key.replace(/_/g, ' ')} checked={value} />
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Keterangan */}
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold", width: "20%" }}>Keterangan</Text>  
              <Text style={{ width: "20%", color: "black", maxWidth: "20%", flexWrap: "wrap" }}>  
                {": " + formatValue(displayValue(data.information))}  
              </Text>
          </View>
          {data.status?.toLowerCase() === 'cancel' && (  
          <View style={{ flexDirection: "row", marginBottom: 5 }}>  
              <Text style={{ fontWeight: "bold", width: "20%" }}>Alasan Cancel</Text>  
              <Text style={{ width: "20%", color: "black", maxWidth: "20%", flexWrap: "wrap" }}>  
                {": " + formatValue(displayValue(data.cancel_reason))}  
              </Text>  
            </View>  
          )}  

       {/* Bukti Kunjungan */}  
       <Text style={{
            fontSize: 10,
            marginBottom: 0,
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#006677",
            color: "#ffffff",
            padding: 6,
            marginTop:  12,
          }}>
            Bukti Kunjungan Dan Feature
          </Text>
        <View style={{ marginTop: 10, gap: 10 }}>  
          <Text style={{ fontWeight: 'bold' }}>Bukti Kunjungan:</Text>  
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>  
          {data.proofOfVisitImages.map((image, index) => {  
                const imagePath = image.media?.path;  
                return imagePath ? (  
                  <View key={index} style={{ marginRight: 10, marginBottom: 10, alignItems: 'center' }}>  
                    <Image  
                      src={imagePath}  
                      style={{ width: 100, height: 100 }}  
                    />  
                    </View>  
                ) : null;  
              })}  

              {data.optionalPhotos.map((image, index) => {  
                const imagePath = image.media?.path;  
                return imagePath ? (  
                  <View key={index} style={{ marginRight: 10, marginBottom: 10, alignItems: 'center' }}>  
                    <Image  
                      src={imagePath}  
                      style={{ width: 100, height: 100 }}  
                    />  
                   </View>  
                ) : null;  
              })}  
          </View>  
        </View>  
                                  
        {/* Feature */}  
        <View style={{ flexDirection: "row", marginTop: 20 }}>  
          <Text style={{ fontWeight: "bold", marginRight: 10 }}>Feature : </Text>  
          <View style={{  
            width: "80%",  
            marginBottom: 20,  
            // shadowColor: "#000",  
            // shadowOffset: {  
            //   width: 0,  
            //   height: 2,  
            // },  
            // shadowOpacity: 0.23,  
            // shadowRadius: 2.62,  
            // elevation: 4,  
            marginLeft: 5,  
          }}>  
            <View style={{  
              flexDirection: "row",  
              backgroundColor: "#006677",  
              color: "#fff",  
              fontWeight: "bold"  
            }}>  
              {["Product", "Serial Number", "Notes", "Action"].map((header, index) => (  
                <View key={index} style={{  
                  flex: 1,  
                  padding: 12,  
                  alignItems: 'center',  
                  borderRightWidth: index === 3 ? 0 : 1,  
                  borderRightColor: "#fff",  
                }}>  
                  <Text style={{ color: "#fff" }}>{header}</Text>  
                </View>  
              ))}  
            </View>  
            {data.products.map((product, index) => (  
              <View style={{  
                flexDirection: "row",  
                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff"  
              }} key={index}>  
                <View style={{  
                  flex: 1,  
                  padding: 12,  
                  alignItems: 'center',  
                  borderRightWidth: 1,  
                  borderRightColor: "#ccc",  
                }}>  
                  <Text>{displayValue(product.name)}</Text>  
                </View>  
                <View style={{  
                  flex: 1,  
                  padding: 12,  
                  alignItems: 'center',  
                  borderRightWidth: 1,  
                  borderRightColor: "#ccc",  
                }}>  
                  <Text>{displayValue(product.serial_number)}</Text>  
                </View>  
                <View style={{  
                  flex: 1,  
                  padding: 12,  
                  alignItems: 'center',  
                  borderRightWidth: 1,  
                  borderRightColor: "#ccc",  
                }}>  
                  <Text>{formatValue(displayValue(product.notes))}</Text>  
                </View>  
                <View style={{  
                  flex: 1,  
                  padding: 12,  
                  alignItems: 'center',  
                }}>  
                  <Text>{formatValue(displayValue(product.action))}</Text>  
                </View>  
              </View>  
            ))}  
          </View>  
        </View>
        </>
      )}
    </Page>
    </Document>
    );
  }
    export default ReportPDF;