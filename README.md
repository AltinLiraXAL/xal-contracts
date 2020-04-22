# ALTIN LIRA (XAL)
Altın Lira (XAL), değeri gram altına endekslenmiş, Ethereum tabanlı, ERC20 Standartlarında bir Token Kontratıdır. Temel yapısı ve transfer protokolü, Ethereum blokzinciri içerisindeki Akıllı Kontrat (Smart Contract) protokolüne göre oluşturulmuştur. Ve Ethereum tabanlı cüzdanlarda saklanır.

https://github.com/AltinLiraXAL/xal-contracts/blob/master/xal-whitepaper-v1.pdf

## ABI, Adres, and Verifikasyon

Kontratın abi dosyası `AltinLiraXAL.abi` dir. Bu proxy kontratına entegre edilmiş bir ERC20 kontratıdır. Proxy kontratı `0x61561529350276b2d44227a078b248d52c67b1dc` adresinde tanımlıdır. Bytecode verifikasyonu alınmış bu kontratın tüm detaylarına ve bütün transaction bilgilerine, https://etherscan.io/address/0x61561529350276b2d44227a078b248d52c67b1dc adresinden ulaşabilirsiniz. 

## Kontrat Özellikleri

Altın Lira (XAL), Merkezi yönetimli,dondurulabilen, arzı kontrol edilebilen bir ERC20 Tokendır.

### ERC20 Token

Genel arayüzü, [EIP-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) tarafından belirtilen arayüzüdür.

- `name()`
- `symbol()`
- `decimals()`
- `totalSupply()`
- `balanceOf(address who)`
- `transfer(address to, uint256 value)`
- `approve(address spender, uint256 value)`
- `allowance(address owner, address spender)`
- `transferFrom(address from, address to, uint256 value)`

Temel Eventler

- `event Transfer(address indexed from, address indexed to, uint256 value)`
- `event Approval(address indexed owner, address indexed spender, uint256 value)`

Bu kontratta, `transfer` medotundaki temel olay, tokenın ödeme olarak gönderilmesidir. İlaveten `transferFrom` ve `approve` metodları ise, diğer bir hesabın, vekalet verilecek 3.bir tarafa ihtiyaç duyulmadan, hesaptaki tokenları, sanki 0x protocol gibi, adresinizden taşımasına, ödeme olarak göndermesine izin vermek için kullanılmaktadır.

### Token Arzının Kontrolü

Altın Lira (XAL) Kontratında,tokenın satın alınmasına, takas edilmesine ve itfa edilmesine yönelik taleplere ve gereksinimlere dayanarak, token basabilen ve yakabilen tek bir `supplyController` adresi vardır. Bu adres başlangıçta `owner` adresidir ve owner tarafından `setSupplyController` fonksiyonu ile bu yetkiler başka bir adrese devredilebilir.

- `supplyController()`

Arz Kontrol Eventleri

- `SupplyIncreased(address indexed to, uint256 value)`
- `SupplyDecreased(address indexed from, uint256 value)`
- `SupplyControllerSet(address indexed oldSupplyController, address indexed newSupplyController)`

### Kontrat’ın Duraklatılması (Pause)

Kritik bir güvenlik tehdidi durumunda `owner`, Altın Lira (XAL) kontratının tüm transferlerini ve onaylarını duraklatma yeteneğine sahiptir. Duraklatma yetkisi sadece ona aittir. 

Bunun için OpenZeppelin sisteminde hazır bulunan, [Ownable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/5daaf60d11ee2075260d0f3adfb22b1c536db983/contracts/ownership/Ownable.sol) ve [Pausable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/5daaf60d11ee2075260d0f3adfb22b1c536db983/contracts/lifecycle/Pausable.sol) modelleri kullanılmıştır.

### İşlem Ücretleri (Fees)

Altın Lira (XAL) Kontratında, Ethereum Ağındaki işlem ücretlerini dengelemek için, tüm Altın Lira (XAL) zincir üstü transferleri için belirli bir ücret uygulama özelliği de bulunmaktadır. 

Ücret kontrolörü, ücret alıcısını ve ücret oranını ayarlama yetkisine sahiptir. Temel işlem ücreti başlangıç ayarların da 0 (Sıfır) olarak belirlenmiştir.

Başlangıçta ücret kontrolörü `owner` dır. İşlem ücretlerini `setFeeRate` fonksiyonu ile düzenler.
Gerekirse `setFeeController` fonksiyonuyla yeni bir yetkili atanabilir. Normalde işlem ücretleri owner hesabına aktarılır. Ve `setFeeRecipient` fonksiyonuyla, işlem ücretlerinin toplanacağı ayrı bir hesap tanımlanabilir.

### Varlık Koruma Yetkisi

Eğer yetkili merciler tarafından, kontrat sahibine, yasadışı bir aktivite, para aklama yada birine ait bir hesabın kötü niyetli kişilerce ele geçirilmesi gibi bir olayla ilgili, mahkeme emri veya yasal bir uyarı yapılırsa, yönetici, bahsi geçen hesabı dondurabilir.

Bu yetki başlangıçta kimseye ait değildir. Yönetici yani `owner` , `setAssetProtectionRole` fonksiyonu ile bu yetkiyi kendisine yada başka bir adrese devredilebilir. Varlık koruma yetkisi özellikleri, Kontratta bulunan `freeze` ve `unfreeze` fonksiyonlarıyla kontrol edilir.

Bu yetki sadece yasal bir emir ve uyarı sonucunda uygulanacaktır.

### Yöneticilik ve Devir İşlemleri

Kontrat yöneticisi başlangıçta, kontratı migrate eden hesaptır. Bu `owner` hesabı ,eğer isterse tüm yönetim yetkilerini başka bir hesaba devredebilir. Bunun için `proposeOwner` fonksiyonu ile ilgili hesaba yöneticilik teklifini başlatır. İlgili hesap, kontratı interact edip `claimOwnership` fonksiyonunu calıştırarak bunu kabul edebilir. Yada `disregardProposeOwner` fonksiyonunu çalıştırıp red eder.

Yeni hesap teklifi onayladıktan hemen sonra owner olacaktır. Eğer bu yeni owner, token yaratma ve silme yetkilerini de almak isterse, önce `setSupplyController` fonksiyonuyla bu yetkiyi kendi hesabına aktarmak zorundadır. Çünkü bu yetki, başlangıçta kontratı migrate eden hesaba aittir. Bu özelliğide aldıktan sonra, yeni hesap tam anlamıyla tüm yetkilerin sahibi olur.

### Güncellenebilir Proxy

Değişmez blokzincir yapısı içinde, güncellenebilir bir kontrat oluşturabilmek için, İki Sözleşmeli Yöntem kullanılmıştır. Bu yapı dahilinde, `delegatecall` kullanılarak, proxy storage dahilindeki temel kontrat kodu çalıştırılır. 

Çalıştırılan yeni kontratın içindeki eski metod ve yapılar korunur ve değiştirilen yapı ve fonksiyonlar ise güncellenir. Bu sayede proxy kontrat bazında, esas kontrat adresi değişmeden, aynı ayarlara sahip ama daha güncel, hatalardan arındırılmış yeni bir entegre kontrat aktive edilebilir. Sonuçta, Blokzincir üzerinde hiçbir hata ve aksama olmadan güncelleme yapılmış olur.

Bunun için ZeppelinOS Framework içinde hazır halde bulunan `AdminUpgradeabilityProxy` modeli kullanılmıştır.
https://github.com/OpenZeppelin/openzeppelin-sdk/tree/master/packages/lib/contracts/upgradeability

## Güncelleme Süreci

Entegre edilen kontrat non-admin mantığıyla kullanılmaktadır. Yeni entegre edilecek kontrat, proxy kontratındaki `upgradeTo()` yada `upgradeToAndCall()` metodlarından herhangi biriyle çağrılarak tamamen yeni yada kısmen güncellenmiş olarak eskisiyle birleştirilir.

## Bytecode Onayı

Bytecode onayı almış; Proxy kontrat ve entegre edilmiş kontrat, https://etherscan.io/address/0x61561529350276b2d44227a078b248d52c67b1dc adresindeki `Contract` butonunun altındadır.


## Kontrat Test Adımları

İlk olarak lokal Ethereum ağı olan Ganache çalıştırılır.

`ganache-cli`

Başka bir terminal penceresi açılır.

Ve aşağıdaki kod çalıştırılır

`make test-contracts`

Coverage Raporu için, ayrıca `make test-contracts-coverage` kodu çalıştırılabilir.
